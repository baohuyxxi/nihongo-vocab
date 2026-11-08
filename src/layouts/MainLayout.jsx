import Sidebar from "../components/Sidebar";
import AppRoutes from "../routes/AppRoutes";

export default function MainLayout() {
  return (
    <div className="flex w-full max-w-full overflow-x-hidden">
      <Sidebar />

      <main className="flex-1 min-h-screen bg-gray-100 p-3 sm:p-4 md:p-5 min-w-0 overflow-x-hidden">
        <AppRoutes />
      </main>
    </div>
  );
}
    