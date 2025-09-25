// import { ModeToggle } from "@shared/ui/modeToggle";
import { Link } from "react-router-dom";
import { Button } from "@shared/ui/button";
import Logo from "@widgets/Navbar/assets/logo.svg";
// import { UserDropdown } from "@features/ui/UserDropdown";

export const Navbar = () => {
  return (
    <div className="max-w-[1440px] w-full flex items-center justify-between px-6 py-4">
      {/* Логотип */}
      <Link to="/" className="flex items-center gap-2">
        <img src={Logo} alt="логотип" />
      </Link>

      {/* Кнопки */}
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
    </div>
  );
};
