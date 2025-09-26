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

export const Profile = () => {
  return (
    <div className="flex min-h-screen w-full max-w-[1440px] mt-20 bg-white">
      {/* Сайдбар */}
      <Sidebar />

      {/* Контент */}
      <main className="flex-1 border-l border-gray-200 mt-10 px-6 space-y-6">
        <div className="max-w-2xl p-2">
          <Card className="space-y-1 border-none shadow-none">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Общая информация
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Название ЛК</Label>
                <Input
                  id="name"
                  defaultValue="ЛК ФГБУЗ «Центр гигиены и эпидемиологии в Липецкой области»"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Эл. адрес</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="fgbuz.cgiainlo@gmail.com"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="space-y-1 border-none shadow-none">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Смена пароля
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="oldPassword">Старый пароль</Label>
                <Input
                  id="oldPassword"
                  type="password"
                  placeholder="Введите пароль"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Новый пароль</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Введите пароль"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Подтвердите новый пароль
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Введите пароль"
                />
              </div>
            </CardContent>
            <CardFooter className="flex space-x-2 max-w-2xl w-full">
              <div className="flex-1">
                <Button className="bg-[#E6E8EB] text-[#ACBBCB] border-none w-full">
                  Отменить
                </Button>
              </div>
              <div className="flex-1">
                <Button className="bg-blue-600 hover:bg-blue-700 w-full">
                  Сохранить
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};
