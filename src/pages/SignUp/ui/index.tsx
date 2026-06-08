import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@shared/ui/button";
import { InputWithLabel } from "@shared/ui/inputLabel";
import { InputWithPassword } from "@shared/ui/inputPassword";
import { Alert, AlertTitle, AlertDescription } from "@shared/ui/alert";
import { Select } from "@shared/ui/dropdown";
import { Label } from "@shared/ui/label";
import { useRegister } from "@features/auth/hooks/useRegister";
import clsx from "clsx";
import { SourceOptions } from "@shared/config/selectOptions";

export const SignUp = () => {
  const { register, loading, error, success, setError } = useRegister();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [terOtdelId, setTerOtdelId] = useState("");

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate("/sign-in");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !login.trim() || !password.trim() || !terOtdelId) {
      setError("Заполните все поля");
      return;
    }

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    if (password.length < 4) {
      setError("Пароль должен быть не менее 4 символов");
      return;
    }

    await register({
      full_name: fullName.trim(),
      login: login.trim(),
      password,
      ter_otdel_id: terOtdelId,
    });
  };

  return (
    <>
      {(error || success) && (
        <div
          className={clsx(
            "fixed top-4 left-1/2 z-50 transform -translate-x-1/2 transition-all duration-300",
            "w-[90%] max-w-md"
          )}
        >
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Ошибка регистрации</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert>
              <AlertTitle>Успешно!</AlertTitle>
              <AlertDescription>
                Аккаунт создан. Перенаправление на страницу входа...
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      <div className="h-screen -mt-22 sm:mt-0 flex justify-center w-full items-center px-4">
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-4 rounded-xl py-10 px-8 border-1 border-gray-300 bg-white w-full max-w-[500px]"
        >
          <h3 className="text-center text-[16px] font-semibold mb-4">
            Регистрация
          </h3>

          <InputWithLabel
            label="ФИО"
            id="full_name"
            type="text"
            placeholder="Введите ФИО"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <InputWithLabel
            label="Логин"
            id="login"
            type="text"
            placeholder="Введите логин"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />

          <div className="flex flex-col gap-1">
            <Label>Территориальный отдел</Label>
            <Select
              placeholder="Выберите территориальный отдел"
              items={SourceOptions}
              value={terOtdelId}
              onValueChange={(v) => setTerOtdelId(v)}
              disabled={loading}
            />
          </div>

          <InputWithPassword
            label="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <InputWithPassword
            label="Подтвердите пароль"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Регистрация..." : "Зарегистрироваться"}
          </Button>

          <p className="text-center text-sm text-gray-500">
            Уже есть аккаунт?{" "}
            <Link to="/sign-in" className="text-blue-500 hover:underline">
              Войти
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};
