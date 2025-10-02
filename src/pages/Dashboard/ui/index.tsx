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
import { useState, useEffect } from "react";
import { getRequests } from "@features/request/hooks/useRequestsLog";
import type { Request } from "@features/request/hooks/useRequestsLog";

// Тип для статистики
interface DashboardStats {
  total: number;
  new: number;
  inProgress: number;
  completed: number;
}

// Тип для данных графика
interface ChartData {
  name: string;
  value: number;
}

export const DashboardPage = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    new: 0,
    inProgress: 0,
    completed: 0
  });
  const [chartData, setChartData] = useState<ChartData[]>([]);

  // Загрузка данных
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getRequests();
        setRequests(data);
        calculateStats(data);
        generateChartData(data);
        setError(null);
      } catch (err: any) {
        console.error('Ошибка при загрузке данных:', err);
        setError('Произошла ошибка при загрузке данных');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Расчет статистики
  const calculateStats = (data: Request[]) => {
    const stats: DashboardStats = {
      total: data.length,
      new: data.filter(request => request.status === 'Новая' || request.status === 'new').length,
      inProgress: data.filter(request => request.status === 'В работе' || request.status === 'in_progress').length,
      completed: data.filter(request => request.status === 'Завершена' || request.status === 'completed').length
    };
    setStats(stats);
  };

  // Генерация данных для графика (последние 10 дней)
  const generateChartData = (data: Request[]) => {
    const last10Days = Array.from({ length: 10 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toLocaleDateString('ru-RU');
    }).reverse();

    const chartData = last10Days.map(date => {
      const count = data.filter(request => {
        const requestDate = new Date(request.created_at).toLocaleDateString('ru-RU');
        return requestDate === date;
      }).length;

      return {
        name: date,
        value: count
      };
    });

    setChartData(chartData);
  };

  // Преобразование данных для таблицы
  const tableData = requests.slice(0, 5).map(request => ({
    id: request.id,
    number: request.number || `APP-${request.id.substring(0, 8).toUpperCase()}`,
    applicant: request.applicant?.name || 'Не указан',
    urgency: request.urgency || 'Не указана',
    date: request.created_at 
      ? new Date(request.created_at).toLocaleDateString('ru-RU')
      : 'Не указана',
    address: request.address || 'Не указан',
    dogsCount: request.dogs_count || 0,
    behavior: request.behavior || 'Не указано',
    contactPerson: request.contact_person || 'Не указано',
    status: request.status || 'Не указан',
    source: request.source || { id: '', name: '' }
  }));

  const statsCards = [
    { label: "Всего заявок", value: stats.total },
    { label: "Новые заявки", value: stats.new },
    { label: "В работе", value: stats.inProgress },
    { label: "Завершено", value: stats.completed },
  ];

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
      {/* Сайдбар */}
      <Sidebar />
      
      {/* Контент */}
      <main className="flex-1 border-l border-gray-200 p-6 space-y-6">
        {/* Статистика */}
        <div className="sm:w-full w-[350px] overflow-x-auto flex gap-6">
          {statsCards.map((item) => (
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
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${value} заявок`, 'Количество']}
                      labelFormatter={(label) => `Дата: ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={{ fill: '#3B82F6', strokeWidth: 2 }}
                      activeDot={{ r: 6, fill: '#1D4ED8' }}
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