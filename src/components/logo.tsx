import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4.5 4.5h15v15h-15z" fill="hsl(var(--primary))" stroke="none" />
      <path d="M9 9v6l3-3" stroke="hsl(var(--primary-foreground))" />
      <path d="M15 15V9l-3 3" stroke="hsl(var(--primary-foreground))" />
    </svg>
  );
}
