import { UploadForm } from '@/components/upload/upload-form';

export default function UploadPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Tokenize a New Invoice
        </h1>
        <p className="text-muted-foreground">
          Fill out the details below to upload your invoice and get an automated
          risk assessment powered by AI.
        </p>
      </div>
      <UploadForm />
    </div>
  );
}
