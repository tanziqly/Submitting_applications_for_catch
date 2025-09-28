// pages/order-log.tsx
import { useState, useEffect } from 'react';
import { ApplicationsTable } from "@shared/ui/orders";
import { Sidebar } from "@shared/ui/sidebar";
import { getRequests } from "@features/request/hooks/useRequestsLog";
import type { Request } from "@features/request/hooks/useRequestsLog";

export const OrderLog = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const data = await getRequests();
        setRequests(data);
        setError(null);
      } catch (err: any) {
        console.error('Ошибка при загрузке заявок:', err);
        setError(
          err.response?.data?.message || 
          err.message || 
          'Произошла ошибка при загрузке заявок'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Преобразуем данные для таблицы
  const tableData = requests.map(request => ({
    id: request.id,
    number: request.number,
    applicant: request.applicant.name,
    address: request.address,
    dogsCount: request.dogs_count,
    urgency: request.urgency,
    status: request.status,
    date: new Date(request.created_at).toLocaleDateString('ru-RU'),
    behavior: request.behavior,
    contactPerson: request.contact_person,
  }));

  if (loading) {
    return (
      <div className="flex min-h-screen w-full max-w-[1440px] mt-20 bg-white">
        <Sidebar />
        <main className="flex-1 border-l border-gray-200 px-6 space-y-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Загрузка заявок...</div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen w-full max-w-[1440px] mt-20 bg-white">
        <Sidebar />
        <main className="flex-1 border-l border-gray-200 px-6 space-y-6">
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
      <Sidebar />
      <main className="flex-1 border-l border-gray-200 px-6 space-y-6">
        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{requests.length}</div>
            <div className="text-blue-800">Всего заявок</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {requests.filter(r => r.urgency === 'Срочно').length}
            </div>
            <div className="text-green-800">Срочные</div>
          </div>
        </div>

        {/* Таблица */}
        <div className="sm:w-full w-[380px] overflow-x-auto">
          <ApplicationsTable
            title="Все заявки"
            data={tableData}
            showMoreButton={false}
          />
        </div>
      </main>
    </div>
  );
};
