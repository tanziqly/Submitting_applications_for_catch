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
        
        console.log('Полученные данные:', data);
        console.log('Тип данных:', typeof data);
        console.log('Является массивом:', Array.isArray(data));
        console.log('Количество элементов:', data.length);
        
        setRequests(data);
        setError(null);
      } catch (err: any) {
        console.error('Ошибка при загрузке заявок:', err);
        console.error('Данные ошибки:', err.response?.data);
        
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

  // Преобразуем данные для таблицы с порядковыми номерами
  const tableData = requests.map((request, index) => ({
    id: request.id,
    number: `${index + 1}`, // Простой порядковый номер
    applicant: request.applicant?.name || 'Не указан',
    address: request.address || 'Не указан',
    dogsCount: request.dogs_count || 0,
    urgency: request.urgency || 'Не указана',
    status: request.status || 'Не указан',
    date: request.created_at 
      ? new Date(request.created_at).toLocaleDateString('ru-RU')
      : 'Не указана',
    behavior: request.behavior || 'Не указано',
    contactPerson: request.contact_person || 'Не указано',
    source: request.source || { id: '', name: '' },
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