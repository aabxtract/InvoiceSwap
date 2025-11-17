export type Invoice = {
  id: string;
  invoiceNumber: string;
  payerName: string;
  payerEmail: string;
  amount: number;
  dueDate: string;
  issueDate: string;
  status: 'Pending' | 'Funded' | 'Paid';
  riskScore?: number;
  riskAssessment?: string;
};
