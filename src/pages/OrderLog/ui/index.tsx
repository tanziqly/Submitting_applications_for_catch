// pages/order-log.tsx
import { ApplicationsTable } from "@shared/ui/orders";
import { Sidebar } from "@shared/ui/sidebar";
import { useOrderLogData } from "@features/ordersLog/hooks/useOrderLogData";

export const OrderLog = () => {
  const { requests, loading, error, tableData } = useOrderLogData();

  if (loading) {
    return (
      <div className="flex min-h-screen w-full max-w-[1440px] mt-20 bg-white">
        <Sidebar className="hidden lg:block" />
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
        <Sidebar className="hidden lg:block" />
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
    <div className="flex-1 lg:flex lg:flex-row min-h-screen w-full max-w-[1440px] mt-20 bg-white">
      <Sidebar className="hidden lg:block" />
      <main className="flex-1 border-l border-gray-200 px-6 space-y-6">
        {/* Таблица */}
        <div className="min-w-full flex pb-2 gap-6 overflow-x-auto flex-nowrap">
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