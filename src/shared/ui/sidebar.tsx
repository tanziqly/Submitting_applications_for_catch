import { ClipboardPlus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const Sidebar = () => {
  const location = useLocation();

  return (
    <div>
      <div className="text-xl mt-4 font-medium flex items-center gap-2 mb-4">
        <ClipboardPlus /> Главная
      </div>
      <aside className="w-60 rounded-xl border border-gray-200 h-fit mr-4 p-4 space-y-2">
        <nav className="flex flex-col gap-2 text-base">
          <button
            className={`w-full text-left rounded-md text-base px-4 py-2 font-medium transition ${
              location.pathname === "/dashboard"
                ? "bg-blue-100 hover:bg-blue-200"
                : "hover:bg-gray-100"
            }`}
          >
            <Link to="/dashboard">Главная</Link>
          </button>
          <button
            className={`w-full text-left rounded-md px-4 py-2 transition ${
              location.pathname === "/order-log"
                ? "bg-blue-100 font-medium hover:bg-blue-200"
                : "hover:bg-gray-100"
            }`}
          >
            <Link to="/order-log">Журнал заявок</Link>
          </button>
          <button
            className={`w-full text-left rounded-md px-4 py-2 transition ${
              location.pathname === "/profile"
                ? "bg-blue-100 font-medium hover:bg-blue-200"
                : "hover:bg-gray-100"
            }`}
          >
            <Link to="/profile">Профиль</Link>
          </button>
          <button className="w-full text-left rounded-md px-4 py-2 hover:bg-gray-100 transition">
            Выйти
          </button>
        </nav>
      </aside>
    </div>
  );
};
