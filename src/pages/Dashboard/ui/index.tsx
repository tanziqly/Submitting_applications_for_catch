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
import { useDashboardData } from "@features/dashboard/hooks/useDashboardData";
import { useTableData } from "@features/dashboard/hooks/useTableData";
import { useStatsCards } from "@features/dashboard/hooks/useStatsCards";

export const DashboardPage = () => {
  const { requests, loading, error, stats, chartData } = useDashboardData();

  const tableData = useTableData(requests);
  const statsCards = useStatsCards(stats);

  if (loading) {
    return (
      <div className="flex min-h-screen w-full max-w-[1440px] mt-20 bg-white">
        <Sidebar />
        <main className="flex-1 border-l border-gray-200 p-6 space-y-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Загрузка данных...</div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen w-full max-w-[1440px] mt-20 bg-white">
        <Sidebar />
        <main className="flex-1 border-l border-gray-200 p-6 space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-800 font-medium">Ошибка загрузки</div>
            <div className="text-red-600 mt-1">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Попробовать снова
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full max-w-[1440px] mt-20 bg-white">
      <Sidebar className="hidden lg:block" />

      <main className="flex-1 w-full border-l border-gray-200 p-6 space-y-6">
        {/* Статистика */}
        <div className="min-w-full flex pb-2 gap-6 overflow-x-auto flex-nowrap">
          {statsCards.map((item) => (
            <Card key={item.label} className="w-[250px] shrink-0 shadow-sm">
              <CardContent className="px-6 text-left">
                <div className="text-4xl font-medium">{item.value}</div>
                <div className="text-gray-600">{item.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* График */}
        <div className="min-w-full flex pb-2 gap-6 overflow-x-auto flex-nowrap">
          <div className="min-w-[700px] sm:min-w-full">
            <Card className="border-none shadow-none">
              <CardHeader>
                <CardTitle>Статистика заявок за последние 10 дней</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      interval={0}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis
                      allowDecimals={false}
                      tickFormatter={(value: any) => Math.floor(value).toString()}
                    />
                    <Tooltip
                      formatter={(value: any) => [`${value} заявок`, "Количество"]}
                      labelFormatter={(label: string) => `Дата: ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={{ fill: "#3B82F6", strokeWidth: 2 }}
                      activeDot={{ r: 6, fill: "#1D4ED8" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Таблица */}
        <div className="min-w-full flex pb-2 gap-6 overflow-x-auto flex-nowrap">
          <ApplicationsTable
            title="Последние заявки"
            data={tableData}
            showMoreButton={true}
            maxVisibleRows={10}
            hideCheckboxes={true}
          />
        </div>
      </main>
    </div>
  );
};