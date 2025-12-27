import { Button } from "@shared/ui/button";
import { Sidebar } from "@shared/ui/sidebar";
import { useState } from "react";

export const Admin = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState("");
  const [login, setLogin] = useState("");

  return (
    <div className="mt-22 flex w-full justify-center">
      <div className="max-w-[1440px] flex w-full">
        <Sidebar className="hidden lg:block" />

        <main className="flex-1 w-full flex flex-col border-l border-gray-200 p-6 space-y-6">
          <h2 className="text-start text-xl font-bold mb-2">Заявки:</h2>

          <div className="border p-4 h-fit w-full flex justify-between items-center rounded-lg shadow-sm">
            <div>
              <h3 className="text-sm text-neutral-500">Заявка</h3>
              <span className="font-[500]">Иванов Иван Иванович</span>
            </div>
            <Button className="rounded-sm" onClick={() => setIsOpen(true)}>
              Открыть
            </Button>
          </div>

          {/* МОДАЛКА */}
          {isOpen && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg w-[400px] p-6 shadow-lg">
                <h3 className="text-lg font-bold mb-4">Заявка</h3>

                <div className="mb-3">
                  <label className="text-sm text-neutral-500">ФИО</label>
                  <div className="font-medium">Иванов Иван Иванович</div>
                </div>

                <div className="mb-3">
                  <label className="text-sm text-neutral-500">Роль</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Например: admin"
                  />
                </div>

                <div className="mb-5">
                  <label className="text-sm text-neutral-500">Логин</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    placeholder="ivanov"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    className="border bg-white text-blue-500 hover:bg-blue-100"
                    onClick={() => setIsOpen(false)}
                  >
                    Отмена
                  </Button>
                  <Button
                    className="rounded-sm"
                    onClick={() => {
                      console.log({ role, login });
                      setIsOpen(false);
                    }}
                  >
                    Сохранить
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
