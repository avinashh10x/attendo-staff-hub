
import { Sidebar } from "@/components/Sidebar";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 ml-16 md:ml-64 transition-all duration-300 min-h-screen">
        <main className={cn("container mx-auto p-4 md:p-6", className)}>
          {children}
        </main>
      </div>
    </div>
  );
}
