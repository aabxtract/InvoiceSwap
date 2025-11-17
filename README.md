# InvoiceSwap

InvoiceSwap is a platform for tokenizing and trading invoices, built with Next.js and Firebase. It enables small and medium enterprises (SMEs) to gain immediate liquidity by selling their unpaid invoices as tokenized assets to investors in a decentralized marketplace. The application utilizes AI to perform risk assessments on each invoice, empowering investors to make well-informed decisions.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **UI**: React
- **Component Library**: ShadCN UI
- **Styling**: Tailwind CSS
- **Generative AI**: Google Genkit
- **Icons**: Lucide React

## Key Features

### 1. Dashboard
The dashboard provides a comprehensive overview of key performance indicators (KPIs) for the user's invoice portfolio. It includes metrics such as:
- Total Value Locked (TVL)
- Number of active invoices
- Average risk score across all invoices
- Monthly volume trends

### 2. Invoice Marketplace
A decentralized marketplace where investors can browse and purchase tokenized invoices. Invoices can be filtered by risk level and sorted by due date to help investors find opportunities that match their risk appetite.

### 3. AI-Powered Invoice Upload & Risk Assessment
SMEs can upload new invoices to be tokenized. The platform uses a Genkit flow to call a Gemini model, which performs an automated risk assessment based on payer history, industry trends, and invoice details. This provides a risk score and a detailed textual assessment for each invoice.

## Getting Started

To run the application locally, you'll need Node.js and npm installed.

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:9002`.

## Project Structure

- `src/app/`: Contains the core application routes using the Next.js App Router.
  - `(app)/`: Groups the main authenticated routes like dashboard, marketplace, and upload.
- `src/components/`: Reusable React components, organized by feature (e.g., `dashboard`, `marketplace`).
- `src/ai/`: Houses the Genkit AI flows.
  - `flows/assess-invoice-risk.ts`: Defines the flow for assessing invoice risk using a generative model.
- `src/lib/`: Contains shared utilities, data, and type definitions.
  - `actions.ts`: Server Actions for handling form submissions and mutations.
  - `data.ts`: Mock data used for demonstration purposes.
- `public/`: Static assets.
- `tailwind.config.ts`: Configuration for Tailwind CSS.
- `next.config.ts`: Configuration for Next.js.