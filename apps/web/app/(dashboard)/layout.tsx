import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";


export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      {/* Sidebar */}
      <nav>
        <aside className="w-64 flex flex-col justify-between h-screen border-r border-slate-6 p-4">
            <Sidebar />
        </aside>
      </nav>

      {/* Main Content */}
      <main className="w-full">
        <nav className="border-b h-15 border-slate-6 flex items-center justify-end px-6">
            <Button variant={"secondary"}>
              Feedback
            </Button>
        </nav>
        {children}
      </main>
    </div>
  );
}
