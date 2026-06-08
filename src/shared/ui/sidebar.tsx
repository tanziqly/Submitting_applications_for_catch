import { ClipboardPlus } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authStore } from "@features/auth";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@shared/ui/dialog";
import { Button } from "@shared/ui/button";
import clsx from "clsx";

interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true);
  };

  const handleConfirmLogout = () => {
    authStore.logout();
    navigate("/");
    setShowLogoutConfirmation(false);
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirmation(false);
  };

  return (
    <aside className={clsx(className, "w-60 h-fit mr-4 p-4")}>
      <div className="text-xl mt-2 mb-4 font-medium flex items-center gap-2">
        <ClipboardPlus /> Навигация
      </div>
      <nav className="flex flex-col gap-2 text-base border border-gray-200 rounded-xl p-2">
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

        <button
          className="w-full text-left rounded-md px-4 py-2 hover:bg-gray-100 transition"
          onClick={handleLogoutClick}
        >
          Выйти
        </button>
      </nav>

      {/* Модальное окно подтверждения выхода */}
      <Dialog
        open={showLogoutConfirmation}
        onOpenChange={setShowLogoutConfirmation}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Подтверждение выхода</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">Вы уверены?</p>
          </div>
          <DialogFooter className="flex gap-2 justify-end w-full">
            <Button
              className="w-[125px]"
              variant="outline"
              color="grey"
              onClick={handleCancelLogout}
            >
              Отмена
            </Button>
            <Button
              className="w-[125px]"
              variant="destructive"
              color="default"
              onClick={handleConfirmLogout}
            >
              Выйти
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
};
