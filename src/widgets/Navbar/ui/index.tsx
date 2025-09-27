import { Link } from "react-router-dom";
import { Button } from "@shared/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@shared/ui/sheet"; // shadcn/ui
import { Menu } from "lucide-react";
import Logo from "@widgets/Navbar/assets/logo.svg";
import { authStore } from "@features/auth/store/authStore";
import { observer } from "mobx-react-lite";

export const Navbar = observer(() => {
  // 👉 Здесь любая реальная проверка авторизации:
  const { isAuthenticated, user, logout } = authStore; // например, стейт из redux, react-query, context

  const AuthMenu = () => (
    <nav className="flex flex-col gap-2 text-base">
      <Link
        to="/dashboard"
        className="rounded-md px-4 py-2 hover:bg-gray-100 transition"
      >
        Главная
      </Link>
      <Link
        to="/order-log"
        className="rounded-md px-4 py-2 hover:bg-gray-100 transition"
      >
        Журнал заявок
      </Link>
      <Link
        to="/profile"
        className="rounded-md px-4 py-2 hover:bg-gray-100 transition"
      >
        Профиль
      </Link>
      <button className="text-left rounded-md px-4 py-2 hover:bg-gray-100 transition">
        Выйти
      </button>
    </nav>
  );

  return (
    <div className="max-w-[1440px] bg-white w-full flex items-center justify-between px-6 py-4 border-b">
      {/* Логотип */}
      <Link to="/" className="flex items-center gap-2">
        <img src={Logo} alt="логотип" />
      </Link>

      {/* Правый блок */}
      {!isAuthenticated ? (
        <div className="flex items-center gap-3">
          <Link to="/sign-in">
            <Button variant="default" size="default" color="outline">
              Войти
            </Button>
          </Link>
          <Link to="/application">
            <Button variant="default" size="default">
              Подать заявку
            </Button>
          </Link>
        </div>
      ) : (
        // 👉 гамбургер-меню
        <Sheet>
          <SheetTrigger asChild>
            <button className="p-2 rounded-md hover:bg-gray-100">
              <Menu className="w-6 h-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-60 p-4">
            <AuthMenu />
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
});
