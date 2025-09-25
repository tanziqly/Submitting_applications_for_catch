import { Card, CardHeader, CardTitle, CardContent } from "@shared/ui/card";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ApplicationsTable } from "@shared/ui/orders";
import { Link } from "react-router-dom";
import { ClipboardPlus } from "lucide-react";

// --- FSD структура ---
// src/pages/dashboard/ui/DashboardPage.tsx
// src/pages/dashboard/lib/data.ts
// src/pages/dashboard/index.ts

const stats = [
  { label: "Всего заявок", value: 54 },
  { label: "Новые заявки", value: 17 },
  { label: "В работе", value: 27 },
  { label: "Завершено", value: 10 },
];

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
];

const chartData = [
  { name: 0, value: 750 },
  { name: 1, value: 720 },
  { name: 2, value: 680 },
  { name: 3, value: 760 },
  { name: 4, value: 740 },
  { name: 5, value: 580 },
  { name: 6, value: 820 },
  { name: 7, value: 760 },
  { name: 8, value: 780 },
  { name: 9, value: 400 },
];

export const DashboardPage = () => {
  return (
    <div className="flex min-h-screen w-full max-w-[1440px] mt-20 bg-white">
      {/* Сайдбар */}
      <div>
        <div className="text-xl mt-4 font-medium flex items-center gap-2 mb-4">
          <ClipboardPlus /> Главная
        </div>
        <aside className="w-60 rounded-xl border border-gray-200 h-fit mr-4 p-4 space-y-2">
          <nav className="flex flex-col gap-2 text-base">
            <button className="w-full text-left rounded-md text-base px-4 py-2 bg-blue-100 font-medium hover:bg-blue-200 transition">
              Главная
            </button>
            <button className="w-full text-left rounded-md px-4 py-2 hover:bg-gray-100 transition">
              <Link to="/order-log">Журнал заявок</Link>
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
      <main className="flex-1 border-l border-gray-200 p-6 space-y-6">
        {/* Статистика */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((item) => (
            <Card key={item.label} className="shadow-sm">
              <CardContent className="px-6 text-left">
                <div className="text-4xl font-medium">{item.value}</div>
                <div className="text-gray-600">{item.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* График */}
        <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle>Статистика заявок</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3B82F6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Таблица */}
        <ApplicationsTable
          title="Последние заявки"
          data={tableData}
          showMoreButton={true}
          maxVisibleRows={5}
        />
      </main>
    </div>
  );
};
