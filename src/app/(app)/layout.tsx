import { Header } from '@/components/header';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <AppSidebar />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <main className="flex flex-1 flex-col gap-4 bg-background sm:gap-8">
            <Header />
            <div className="p-4 sm:px-6 sm:py-0">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
