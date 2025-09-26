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
import { Sidebar } from "@shared/ui/sidebar";

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
      <Sidebar />
      {/* Контент */}
      <main className="flex-1 border-l border-gray-200 p-6 space-y-6">
        {/* Статистика */}
        <div className="sm:w-full w-[350px] overflow-x-auto flex gap-6">
          {stats.map((item) => (
            <Card
              key={item.label}
              className="w-[250px] shadow-sm min-w-[200px] sm:w-[250px]"
            >
              <CardContent className="px-6 text-left">
                <div className="text-4xl font-medium">{item.value}</div>
                <div className="text-gray-600">{item.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* График */}
        <div className="sm:w-full w-[350px] overflow-x-auto">
          <div className="sm:w-full w-[900px]">
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
          </div>
        </div>

        {/* Таблица */}
        <div className="sm:w-full w-[380px] overflow-x-auto">
          <ApplicationsTable
            title="Последние заявки"
            data={tableData}
            showMoreButton={true}
            maxVisibleRows={5}
          />
        </div>
      </main>
    </div>
  );
};
