import Sidebar from "../components/Sidebar";
import AppRoutes from "../routes/AppRoutes";

export default function MainLayout() {
  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 min-h-screen bg-gray-100 p-4">
        <AppRoutes />
      </main>
    </div>
  );
}
    