;; Token Swap Contract
;; Decentralized token exchange with liquidity pools

;; Error codes
(define-constant ERR-NOT-AUTHORIZED (err u1))
(define-constant ERR-INVALID-AMOUNT (err u2))
(define-constant ERR-INSUFFICIENT-LIQUIDITY (err u3))
(define-constant ERR-SLIPPAGE-TOO-HIGH (err u4))
(define-constant ERR-ZERO-LIQUIDITY (err u5))
(define-constant ERR-INVALID-TOKEN (err u6))

;; Contract owner
(define-constant CONTRACT-OWNER tx-sender)

;; Fee basis points (0.3% = 30 basis points)
(define-constant FEE-BP u30)
(define-constant BP-DENOMINATOR u10000)

;; Liquidity pool reserves
(define-data-var reserve-stx uint u0)
(define-data-var reserve-token uint u0)
(define-data-var total-lp-tokens uint u0)

;; LP token balances
(define-map lp-balances principal uint)

;; SIP-010 token trait reference
(define-trait sip-010-trait
  (
    (transfer (uint principal principal (optional (buff 34))) (response bool uint))
    (get-balance (principal) (response uint uint))
  )
)

;; Add liquidity to pool
(define-public (add-liquidity (token <sip-010-trait>) (stx-amount uint) (token-amount uint))
  (let
    (
      (current-stx (var-get reserve-stx))
      (current-token (var-get reserve-token))
      (total-lp (var-get total-lp-tokens))
      (sender-lp (default-to u0 (map-get? lp-balances tx-sender)))
    )
    (asserts! (> stx-amount u0) ERR-INVALID-AMOUNT)
    (asserts! (> token-amount u0) ERR-INVALID-AMOUNT)
    
    ;; Calculate LP tokens to mint
    (let
      (
        (lp-to-mint (if (is-eq total-lp u0)
          ;; First liquidity provider
          (sqrti (* stx-amount token-amount))
          ;; Subsequent providers (proportional to pool)
          (min 
            (/ (* stx-amount total-lp) current-stx)
            (/ (* token-amount total-lp) current-token)
          )
        ))
      )
      (asserts! (> lp-to-mint u0) ERR-ZERO-LIQUIDITY)
      
      ;; Transfer tokens to contract
      (try! (stx-transfer? stx-amount tx-sender (as-contract tx-sender)))
      (try! (contract-call? token transfer token-amount tx-sender (as-contract tx-sender) none))
      
      ;; Update reserves
      (var-set reserve-stx (+ current-stx stx-amount))
      (var-set reserve-token (+ current-token token-amount))
      (var-set total-lp-tokens (+ total-lp lp-to-mint))
      
      ;; Mint LP tokens
      (map-set lp-balances tx-sender (+ sender-lp lp-to-mint))
      
      (ok lp-to-mint)
    )
  )
)

;; Remove liquidity from pool
(define-public (remove-liquidity (token <sip-010-trait>) (lp-amount uint))
  (let
    (
      (current-stx (var-get reserve-stx))
      (current-token (var-get reserve-token))
      (total-lp (var-get total-lp-tokens))
      (sender-lp (default-to u0 (map-get? lp-balances tx-sender)))
    )
    (asserts! (> lp-amount u0) ERR-INVALID-AMOUNT)
    (asserts! (>= sender-lp lp-amount) ERR-INSUFFICIENT-LIQUIDITY)
    (asserts! (> total-lp u0) ERR-ZERO-LIQUIDITY)
    
    ;; Calculate amounts to return
    (let
      (
        (stx-to-return (/ (* lp-amount current-stx) total-lp))
        (token-to-return (/ (* lp-amount current-token) total-lp))
      )
      ;; Burn LP tokens
      (map-set lp-balances tx-sender (- sender-lp lp-amount))
      (var-set total-lp-tokens (- total-lp lp-amount))
      
      ;; Update reserves
      (var-set reserve-stx (- current-stx stx-to-return))
      (var-set reserve-token (- current-token token-to-return))
      
      ;; Transfer assets back
      (try! (as-contract (stx-transfer? stx-to-return tx-sender tx-sender)))
      (try! (as-contract (contract-call? token transfer token-to-return tx-sender tx-sender none)))
      
      (ok {stx: stx-to-return, tokens: token-to-return})
    )
  )
)

;; Swap STX for tokens
(define-public (swap-stx-for-token (token <sip-010-trait>) (stx-in uint) (min-token-out uint))
  (let
    (
      (current-stx (var-get reserve-stx))
      (current-token (var-get reserve-token))
    )
    (asserts! (> stx-in u0) ERR-INVALID-AMOUNT)
    (asserts! (> current-token u0) ERR-INSUFFICIENT-LIQUIDITY)
    
    ;; Calculate output with fee
    (let
      (
        (stx-with-fee (- stx-in (/ (* stx-in FEE-BP) BP-DENOMINATOR)))
        (token-out (/ (* stx-with-fee current-token) (+ current-stx stx-with-fee)))
      )
      (asserts! (>= token-out min-token-out) ERR-SLIPPAGE-TOO-HIGH)
      (asserts! (> token-out u0) ERR-INVALID-AMOUNT)
      
      ;; Execute swap
      (try! (stx-transfer? stx-in tx-sender (as-contract tx-sender)))
      (try! (as-contract (contract-call? token transfer token-out tx-sender tx-sender none)))
      
      ;; Update reserves
      (var-set reserve-stx (+ current-stx stx-in))
      (var-set reserve-token (- current-token token-out))
      
      (ok token-out)
    )
  )
)

;; Swap tokens for STX
(define-public (swap-token-for-stx (token <sip-010-trait>) (token-in uint) (min-stx-out uint))
  (let
    (
      (current-stx (var-get reserve-stx))
      (current-token (var-get reserve-token))
    )
    (asserts! (> token-in u0) ERR-INVALID-AMOUNT)
    (asserts! (> current-stx u0) ERR-INSUFFICIENT-LIQUIDITY)
    
    ;; Calculate output with fee
    (let
      (
        (token-with-fee (- token-in (/ (* token-in FEE-BP) BP-DENOMINATOR)))
        (stx-out (/ (* token-with-fee current-stx) (+ current-token token-with-fee)))
      )
      (asserts! (>= stx-out min-stx-out) ERR-SLIPPAGE-TOO-HIGH)
      (asserts! (> stx-out u0) ERR-INVALID-AMOUNT)
      
      ;; Execute swap
      (try! (contract-call? token transfer token-in tx-sender (as-contract tx-sender) none))
      (try! (as-contract (stx-transfer? stx-out tx-sender tx-sender)))
      
      ;; Update reserves
      (var-set reserve-stx (- current-stx stx-out))
      (var-set reserve-token (+ current-token token-in))
      
      (ok stx-out)
    )
  )
)

;; Read-only functions

;; Get reserves
(define-read-only (get-reserves)
  (ok {stx: (var-get reserve-stx), tokens: (var-get reserve-token)})
)

;; Get LP balance
(define-read-only (get-lp-balance (user principal))
  (ok (default-to u0 (map-get? lp-balances user)))
)

;; Get total LP supply
(define-read-only (get-total-lp)
  (ok (var-get total-lp-tokens))
)

;; Quote swap output (STX to token)
(define-read-only (quote-stx-to-token (stx-in uint))
  (let
    (
      (current-stx (var-get reserve-stx))
      (current-token (var-get reserve-token))
      (stx-with-fee (- stx-in (/ (* stx-in FEE-BP) BP-DENOMINATOR)))
    )
    (if (and (> current-stx u0) (> current-token u0))
      (ok (/ (* stx-with-fee current-token) (+ current-stx stx-with-fee)))
      ERR-ZERO-LIQUIDITY
    )
  )
)

;; Quote swap output (token to STX)
(define-read-only (quote-token-to-stx (token-in uint))
  (let
    (
      (current-stx (var-get reserve-stx))
      (current-token (var-get reserve-token))
      (token-with-fee (- token-in (/ (* token-in FEE-BP) BP-DENOMINATOR)))
    )
    (if (and (> current-stx u0) (> current-token u0))
      (ok (/ (* token-with-fee current-stx) (+ current-token token-with-fee)))
      ERR-ZERO-LIQUIDITY
    )
  )
)

;; Helper function: square root approximation
(define-private (sqrti (n uint))
  (if (<= n u1)
    n
    (let ((x (/ n u2)))
      (sqrti-iter n x)
    )
  )
)

(define-private (sqrti-iter (n uint) (x uint))
  (let ((next-x (/ (+ x (/ n x)) u2)))
    (if (>= x next-x)
      next-x
      (sqrti-iter n next-x)
    )
  )
)

;; Helper: minimum of two numbers
(define-private (min (a uint) (b uint))
  (if (< a b) a b)
)
