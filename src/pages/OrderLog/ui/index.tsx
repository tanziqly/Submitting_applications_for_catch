import { ApplicationsTable } from "@shared/ui/orders";
import { ClipboardPlus } from "lucide-react";
import { Link } from "react-router-dom";

const tableData = [
  {
    id: 1,
    applicant: "- Глава администрации Васильевского сельсовета",
    urgency: "Срочно",
    date: "21.07.2025",
  },
  {
    id: 2,
    applicant: "- Глава администрации Васильевского сельсовета",
    urgency: "Срочно",
    date: "21.07.2025",
  },
  {
    id: 3,
    applicant: "- Глава администрации Васильевского сельсовета",
    urgency: "Срочно",
    date: "21.07.2025",
  },
  {
    id: 4,
    applicant: "- Глава администрации Васильевского сельсовета",
    urgency: "Срочно",
    date: "21.07.2025",
  },
  {
    id: 5,
    applicant: "- Глава администрации Васильевского сельсовета",
    urgency: "Срочно",
    date: "21.07.2025",
  },
  {
    id: 5,
    applicant: "- Глава администрации Васильевского сельсовета",
    urgency: "Срочно",
    date: "21.07.2025",
  },
  {
    id: 5,
    applicant: "- Глава администрации Васильевского сельсовета",
    urgency: "Срочно",
    date: "21.07.2025",
  },
  {
    id: 5,
    applicant: "- Глава администрации Васильевского сельсовета",
    urgency: "Срочно",
    date: "21.07.2025",
  },
  {
    id: 5,
    applicant: "- Глава администрации Васильевского сельсовета",
    urgency: "Срочно",
    date: "21.07.2025",
  },
];

export const OrderLog = () => {
  return (
    <div className="flex min-h-screen w-full max-w-[1440px] mt-20 bg-white">
      {/* Сайдбар */}
      <div className="flex flex-col gap-2">
        <div className="text-xl mt-4 font-medium flex items-center gap-2 mb-4">
          <ClipboardPlus /> Журнал заявок
        </div>
        <aside className="w-60 rounded-xl border border-gray-200 h-fit mr-4 p-4 space-y-2">
          <nav className="flex flex-col gap-2 text-base">
            <button className="w-full text-left rounded-md px-4 py-2 hover:bg-gray-100 transition">
              <Link to="/dashboard">Главная</Link>
            </button>
            <button className="w-full text-left rounded-md text-base px-4 py-2 bg-blue-100 font-medium hover:bg-blue-200 transition">
              Журнал заявок
            </button>
            <button className="w-full text-left rounded-md px-4 py-2 hover:bg-gray-100 transition">
              Профиль
            </button>
            <button className="w-full text-left rounded-md px-4 py-2 hover:bg-gray-100 transition">
              Выйти
            </button>
          </nav>
        </aside>
      </div>

      {/* Контент */}
      <main className="flex-1 border-l border-gray-200 px-6 space-y-6">
        {/* Таблица */}
        <ApplicationsTable
          title={"Все заявки"}
          data={tableData}
          showMoreButton={false}
        />
      </main>
    </div>
  );
};
