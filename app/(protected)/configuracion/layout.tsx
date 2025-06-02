import { SettingsSidebar } from "@/app/ui/settings/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full gap-10">
      {/* Main content */}
      <div className="flex flex-col gap-6 flex-1">
        <h1 className="font-bold text-2xl">Configuración</h1>
        {children}
      </div>
      <SettingsSidebar />
    </div>
  );
}
