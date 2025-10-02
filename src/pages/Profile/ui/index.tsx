import { observer } from "mobx-react-lite";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@shared/ui/card";
import { Input } from "@shared/ui/input";
import { Button } from "@shared/ui/button";
import { Label } from "@shared/ui/label";
import { Sidebar } from "@shared/ui/sidebar";
import { authStore } from "@features/auth/store/authStore";
import { useState } from "react";
import { api } from "@shared/api/axios";

interface ChangePasswordData {
  login: string;
  old_password: string;
  new_password: string;
}

export const Profile = observer(() => {
  const { user } = authStore;
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  const handleCancel = () => {
    setPasswordData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setError(null);
    setSuccess(false);
  };

  const handleChangePassword = async () => {
    // Валидация
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setError("Заполните все поля");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Новые пароли не совпадают");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const changePasswordData: ChangePasswordData = {
        login: user?.login || "",
        old_password: passwordData.oldPassword, // изменено на old_password
        new_password: passwordData.newPassword  // изменено на new_password
      };

      console.log("Отправка данных смены пароля:", changePasswordData);

      const response = await api.post("/auth/change-password", changePasswordData);

      console.log("Ответ сервера:", response.data);

      if (response.status === 200) {
        setSuccess(true);
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      }
    } catch (err: any) {
      console.error("Ошибка при смене пароля:", err);
      console.error("Данные ошибки:", err.response?.data);
      
      // Более детальная обработка ошибок
      if (err.response?.status === 400) {
        setError("Неверный старый пароль или некорректные данные");
      } else if (err.response?.status === 500) {
        setError("Ошибка на сервере. Попробуйте позже.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Произошла ошибка при смене пароля");
      }
    } finally {
      setLoading(false);
    }
  };

  // Если пользователь еще не загружен
  if (!user) {
    return (
      <div className="flex min-h-screen w-full max-w-[1440px] mt-20 bg-white">
        <Sidebar />
        <main className="flex-1 border-l border-gray-200 mt-10 px-6 space-y-6">
          <div className="max-w-2xl p-2">
            <div className="text-center py-8">Загрузка данных пользователя...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full max-w-[1440px] mt-20 bg-white">
      <Sidebar />
      <main className="flex-1 border-l border-gray-200 mt-10 px-6 space-y-6">
        <div className="max-w-2xl p-2">
          <Card className="space-y-1 border-none shadow-none">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Общая информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Имя</Label>
                <Input
                  id="name"
                  defaultValue={user.full_name || "Не указано"}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login">Логин</Label>
                <Input
                  id="login"
                  defaultValue={user.login || "Не указан"}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Роль</Label>
                <Input
                  id="role"
                  defaultValue={user.role || "Не указана"}
                  readOnly
                />
              </div>
            </CardContent>
          </Card>

          <Card className="space-y-1 border-none shadow-none">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Смена пароля</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="text-red-800 text-sm">{error}</div>
                </div>
              )}

              {success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-green-800 text-sm">Пароль успешно изменен!</div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="oldPassword">Старый пароль</Label>
                <Input
                  id="oldPassword"
                  type="password"
                  placeholder="Введите старый пароль"
                  value={passwordData.oldPassword}
                  onChange={(e) => handlePasswordChange("oldPassword", e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Новый пароль</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Введите новый пароль"
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Подтвердите новый пароль</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Подтвердите новый пароль"
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                  disabled={loading}
                />
              </div>
            </CardContent>
            <CardFooter className="flex space-x-2 max-w-2xl w-full">
              <div className="flex-1">
                <Button 
                  className="bg-[#E6E8EB] text-black border-none w-full"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Отменить
                </Button>
              </div>
              <div className="flex-1">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 w-full rounded-sm"
                  onClick={handleChangePassword}
                  disabled={loading}
                >
                  {loading ? "Сохранение..." : "Сохранить"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
});