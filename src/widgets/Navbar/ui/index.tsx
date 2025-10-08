import { Link } from "react-router-dom";
import { Button } from "@shared/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@shared/ui/sheet";
import { Menu } from "lucide-react";
import Logo from "@widgets/Navbar/assets/logo.svg";
import { authStore } from "@features/auth/store/authStore";
import { observer } from "mobx-react-lite";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@shared/ui/dialog";
import { useState } from "react";

export const Navbar = observer(() => {
  const { isAuthenticated, user } = authStore;
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true);
  };

  const handleConfirmLogout = () => {
  // Оберните вызов в стрелочную функцию
  authStore.logout();
  navigate("/");
  setShowLogoutConfirmation(false);
};

  const handleCancelLogout = () => {
    setShowLogoutConfirmation(false);
  };

  const AuthMenu = () => (
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
      <button
        onClick={handleLogoutClick}
        className="text-left rounded-md px-4 py-2 hover:bg-gray-100 transition"
      >
        Выйти
      </button>
    </nav>
  );

  return (
    <div className="max-w-[1440px] bg-white w-full flex items-center justify-between px-6 py-4">
      {/* Логотип */}
      <Link
        to={isAuthenticated ? "/dashboard" : "/"}
        className="flex items-center gap-2"
      >
        <img src={Logo} className="w-[100px] sm:w-full" alt="логотип" />
      </Link>

      {/* Правый блок */}
      {!isAuthenticated ? (
        <div className="flex items-center gap-1 sm:gap-3">
          <Link to="/sign-in">
            <Button
              variant="default"
              className="py-1 px-3 sm:py-2 sm:px-4"
              size="default"
              color="outline"
            >
              Войти
            </Button>
          </Link>
          <Link to="/application">
            <Button
              variant="default"
              className="py-1 px-3 sm:py-2 sm:px-4"
              size="default"
            >
              Подать заявку
            </Button>
          </Link>
        </div>
      ) : (
        // 👉 гамбургер-меню
        <>
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 rounded-md hover:bg-gray-100 lg:hidden">
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-60 p-4 lg:hidden">
              <AuthMenu />
            </SheetContent>
          </Sheet>
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">
                {user?.full_name || user?.login || "Пользователь"}
              </span>
            </div>
            {/* Десктопное меню */}
            <nav className="hidden lg:flex items-center gap-2">
              <Link
                to="/dashboard"
                className={`rounded-md px-3 py-2 text-sm transition ${
                  location.pathname === "/dashboard"
                    ? "bg-blue-100 hover:bg-blue-200 font-medium"
                    : "hover:bg-gray-100"
                }`}
              >
                Главная
              </Link>
              <Link
                to="/order-log"
                className={`rounded-md px-3 py-2 text-sm transition ${
                  location.pathname === "/order-log"
                    ? "bg-blue-100 hover:bg-blue-200 font-medium"
                    : "hover:bg-gray-100"
                }`}
              >
                Журнал
              </Link>
              <Link
                to="/profile"
                className={`rounded-md px-3 py-2 text-sm transition ${
                  location.pathname === "/profile"
                    ? "bg-blue-100 hover:bg-blue-200 font-medium"
                    : "hover:bg-gray-100"
                }`}
              >
                Профиль
              </Link>
              <button
                onClick={handleLogoutClick}
                className="rounded-md px-3 py-2 text-sm hover:bg-gray-100 transition"
              >
                Выйти
              </button>
            </nav>
          </div>
        </>
      )}

      {/* Модальное окно подтверждения выхода - ВНЕ условного рендеринга */}
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
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button
              className="w-full"
              variant="outline"
              color="grey"
              onClick={handleCancelLogout}
            >
              Отмена
            </Button>
            <Button
              className="w-full"
              variant="destructive"
              color="default"
              onClick={handleConfirmLogout}
            >
              Выйти
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
});