import { ClipboardPlus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden sm:block w-60 rounded-xl border border-gray-200 h-fit mr-4 p-4">
      <div className="text-xl mt-2 mb-4 font-medium flex items-center gap-2">
        <ClipboardPlus /> Главная
      </div>
      <nav className="flex flex-col gap-2 text-base">
        <Link
          to="/dashboard"
          className={`rounded-md px-4 py-2 transition ${
            location.pathname === "/dashboard"
              ? "bg-blue-100 hover:bg-blue-200 font-medium"
              : "hover:bg-gray-100"
          }`}
        >
          Главная
        </Link>
        <Link
          to="/order-log"
          className={`rounded-md px-4 py-2 transition ${
            location.pathname === "/order-log"
              ? "bg-blue-100 hover:bg-blue-200 font-medium"
              : "hover:bg-gray-100"
          }`}
        >
          Журнал заявок
        </Link>
        <Link
          to="/profile"
          className={`rounded-md px-4 py-2 transition ${
            location.pathname === "/profile"
              ? "bg-blue-100 hover:bg-blue-200 font-medium"
              : "hover:bg-gray-100"
          }`}
        >
          Профиль
        </Link>
        <button className="w-full text-left rounded-md px-4 py-2 hover:bg-gray-100 transition">
          Выйти
        </button>
      </nav>
    </aside>
  );
};
