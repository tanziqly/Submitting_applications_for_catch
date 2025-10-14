import React, { useState, useMemo, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@shared/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@shared/ui/table";
import { Button } from "@shared/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "@shared/api/axios";
import FilterDropdown from "@shared/ui/filter";
import { authStore } from "@features/auth";

interface TableRowData {
  id: number | string;
  number: string;
  applicant: string;
  urgency: string;
  date: string;
  address?: string;
  dogsCount?: number;
  quantity?: number;
  behavior?: string;
  applicantName?: string;
  applicantInfo?: string;
  contactPerson?: string;
  status?: string;
  source?: {
    id: string;
    name: string;
  };
  sortableNumber?: number;
  created_at?: string; // Добавьте это поле
  dogs_count?: number; // Добавьте это поле для совместимости с API
}

interface ApplicationsTableProps {
  title: string;
  data: TableRowData[];
  showMoreButton?: boolean;
  maxVisibleRows?: number;
}

interface OrderModalProps {
  open: boolean;
  onClose: () => void;
  data?: TableRowData;
  onStatusChange?: (id: string | number, newStatus: string) => void;
}

type SortField = "sortableNumber" | "applicant" | "urgency" | "date";
type SortDirection = "asc" | "desc";

// Интерфейс для запроса изменения статуса
interface ChangeStatusRequest {
  id: string;
  status: string; // Статус может быть любой строкой, как указано в API
}

// Функция для изменения статуса через API
const changeRequestStatus = async (
  request: ChangeStatusRequest
): Promise<void> => {
  const response = await api.post("/requests/change-status", request);
  return response.data;
};

const OrderModal: React.FC<OrderModalProps> = ({
  open,
  onClose,
  data,
  onStatusChange,
}) => {
  const [loading, setLoading] = useState(false);
  const [documentError, setDocumentError] = useState<string | null>(null);
  const [isStatusEditMode, setIsStatusEditMode] = useState(false);
  const [localData, setLocalData] = useState<TableRowData | undefined>(data);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const updateStatus = async (newStatus: string) => {
    if (!localData?.id) return;

    try {
      setLoading(true);
      setDocumentError(null);

      // Отправляем запрос на сервер
      await changeRequestStatus({
        id: String(localData.id),
        status: newStatus,
      });

      // Обновляем локальные данные сразу
      setLocalData((prev) => (prev ? { ...prev, status: newStatus } : prev));

      // Уведомляем родительский компонент об изменении статуса
      onStatusChange?.(localData.id, newStatus);

      setIsStatusEditMode(false);
    } catch (err: any) {
      console.error("Ошибка при обновлении статуса:", err);
      setDocumentError(
        err.response?.data?.message || "Не удалось изменить статус заявки"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGetDocument = async () => {
    if (!localData?.number) {
      setDocumentError("Номер заявки не указан");
      return;
    }

    setLoading(true);
    setDocumentError(null);

    try {
      const response = await api.get("/requests/download_url", {
        params: { number: localData.number },
        validateStatus: (status) => status < 500,
      });

      if (response.status === 200 && response.data.url) {
        window.open(response.data.url, "_blank");
        setTimeout(() => onClose(), 1000);
      } else if (response.status === 404) {
        setDocumentError("Документ не найден");
      } else {
        setDocumentError(`Сервер вернул статус: ${response.status}`);
      }
    } catch (error: any) {
      console.error("Ошибка при получении документа:", error);
      setDocumentError("Ошибка при получении документа");
    } finally {
      setLoading(false);
    }
  };

  if (!open || !localData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl p-6 w-full max-w-[450px] shadow-lg relative">
        <button
          className="absolute text-4xl cursor-pointer top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-2xl font-semibold mb-4">
          Заявка {localData.number}
        </h2>

        {documentError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-red-800 text-sm">{documentError}</div>
          </div>
        )}

        {isStatusEditMode ? (
          <div className="space-y-2 mb-4">
            <div className="text-sm font-medium mb-2">
              Выберите новый статус:
            </div>
            {["новая", "в работе", "выполнена", "отменена"].map((status) => (
              <Button
                key={status}
                variant="outline"
                className="w-full bg-neutral-200 hover:bg-neutral-300 border-none text-black"
                onClick={() => updateStatus(status)}
                disabled={loading}
              >
                {loading ? "Изменение..." : status}
              </Button>
            ))}
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => setIsStatusEditMode(false)}
              disabled={loading}
            >
              Отмена
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-2 mb-4">
              <div>
                <b>Адрес:</b> {localData.address || "-"}
              </div>
              <div>
                <b>Количество собак:</b>{" "}
                {localData.dogsCount ?? localData.quantity ?? "-"}
              </div>
              <div>
                <b>Поведение:</b> {localData.behavior || "-"}
              </div>
              <div>
                <b>Срочность:</b> {localData.urgency}
              </div>
              <div>
                <b>Имя заявителя:</b>{" "}
                {localData.applicantName || localData.applicant}
              </div>
              <div>
                <b>Сведения о заявителе:</b>{" "}
                {localData.source?.name || localData.applicantInfo || "-"}
              </div>
              <div>
                <b>Контактное лицо:</b> {localData.contactPerson || "-"}
              </div>
              <div>
                <b>Статус:</b> {localData.status || "-"}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsStatusEditMode(true)}
              >
                Изменить статус
              </Button>
              <Button
                variant="outline"
                className="bg-neutral-300 hover:bg-neutral-400 border-none flex-1"
                onClick={handleGetDocument}
                disabled={loading}
              >
                {loading ? "Загрузка..." : "Получить документ"}
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-white hover:bg-gray-100 border-neutral-300 text-neutral-700"
                onClick={onClose}
              >
                Закрыть
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export const ApplicationsTable = ({
  title,
  data,
  showMoreButton = false,
  maxVisibleRows,
}: ApplicationsTableProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<string | number | null>(
    null
  );
  const [sortField, setSortField] = useState<SortField>("sortableNumber");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [tableData, setTableData] = useState<TableRowData[]>(data);
  const [filteredData, setFilteredData] = useState<TableRowData[]>(data);
  const [isFilterActive, setIsFilterActive] = useState(false);

  useEffect(() => {
    setTableData(data);
    setFilteredData(data);
    setIsFilterActive(false);
  }, [data]);

const handleFilteredData = (filteredRequests: any) => {
  console.log("Данные от фильтра: ", filteredRequests);
  
  // Проверяем разные возможные форматы ответа
  let requestsArray: any[] = [];
  
  if (filteredRequests && Array.isArray(filteredRequests)) {
    // Если пришел массив напрямую (как из /requests)
    requestsArray = filteredRequests;
  } else if (filteredRequests && filteredRequests.data && Array.isArray(filteredRequests.data)) {
    // Если пришел объект с полем data (как из /requests_otdel)
    requestsArray = filteredRequests.data;
  } else {
    console.warn("Неизвестный формат данных:", filteredRequests);
    requestsArray = [];
  }
  
  console.log("Обработанный массив:", requestsArray);
  
  if (requestsArray.length === 0) {
    setFilteredData([]);
    setIsFilterActive(true);
    return;
  }

  // Преобразуем данные в формат TableRowData
  const transformedData: TableRowData[] = requestsArray.map((request, index) => ({
    id: request.id,
    number: request.number || `${index + 1}`,
    applicant: request.applicant?.name || "Не указан",
    urgency: request.urgency || "Не указана",
    date: request.created_at
      ? new Date(request.created_at).toLocaleDateString("ru-RU")
      : "Не указана",
    address: request.address || "Не указан",
    dogsCount: request.dogs_count || 0,
    behavior: request.behavior || "Не указано",
    applicantName: request.applicant?.name || "Не указано",
    contactPerson: request.contact_person || "Не указано",
    status: request.status || "Не указан",
    source: request.source || { id: "", name: "" },
  }));

  console.log("Преобразованные данные:", transformedData);
  setFilteredData(transformedData);
  setIsFilterActive(true);
};

  const handleFilterLoading = (loading: boolean) => {
    // Можно добавить индикатор загрузки если нужно
    console.log("Filter loading:", loading);
  };

  const handleFilterError = (error: string | null) => {
    // Можно показать ошибку если нужно
    if (error) {
      console.error("Filter error:", error);
    }
  };

  const extractNumberFromString = (str: string): number => {
    if (!str) return 0;
    const numbers = str.replace(/[^\d]/g, "");
    return numbers ? parseInt(numbers, 10) : 0;
  };

  // Используем filteredData если фильтр активен, иначе tableData
  const dataToProcess = isFilterActive ? filteredData : tableData;

  const processedData = useMemo(() => {
    return dataToProcess.map((item) => ({
      ...item,
      sortableNumber: extractNumberFromString(item.number),
    }));
  }, [dataToProcess]);

  const sortedData = useMemo(() => {
    const sorted = [...processedData].sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === "date") {
        aValue = new Date(aValue.split(".").reverse().join("-")).getTime();
        bValue = new Date(bValue.split(".").reverse().join("-")).getTime();
      }

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return maxVisibleRows ? sorted.slice(0, maxVisibleRows) : sorted;
  }, [processedData, sortField, sortDirection, maxVisibleRows]);

  const handleRowClick = (row: TableRowData) => {
    setSelectedRowId(row.id);
    setModalOpen(true);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown size={16} />;
    return sortDirection === "asc" ? (
      <span className="text-sm">↑</span>
    ) : (
      <span className="text-sm">↓</span>
    );
  };

  const updateStatus = (id: string | number, newStatus: string) => {
    setTableData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
    // Также обновляем filteredData если фильтр активен
    if (isFilterActive) {
      setFilteredData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    }
  };

  const selectedRow = selectedRowId
    ? dataToProcess.find((item) => item.id === selectedRowId)
    : undefined;

  const { user } = authStore

  return (
    <Card className="border-none w-full shadow-none">
      <CardHeader className="w-full">
        <div className="flex items-center justify-between w-full">
          <CardTitle className="text-xl font-medium">
            {title}
          </CardTitle>
          {!showMoreButton && user?.login === "ryaon_comm" && (
          <FilterDropdown 
            onFilteredData={handleFilteredData}
            onLoading={handleFilterLoading}
            onError={handleFilterError}
          />
        )}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-[#CADDFF]">
              <TableHead
                className="text-center text-[#6C6C6E] cursor-pointer hover:bg-blue-200 transition"
                onClick={() => handleSort("sortableNumber")}
              >
                <div className="flex items-center justify-center gap-1">
                  Номер заявки {getSortIcon("sortableNumber")}
                </div>
              </TableHead>
              <TableHead
                className="text-[#6C6C6E] cursor-pointer hover:bg-blue-200 transition"
                onClick={() => handleSort("applicant")}
              >
                <div className="flex items-center gap-1">
                  Заявитель {getSortIcon("applicant")}
                </div>
              </TableHead>
              <TableHead
                className="text-[#6C6C6E] cursor-pointer hover:bg-blue-200 transition"
                onClick={() => handleSort("urgency")}
              >
                <div className="flex items-center gap-1">
                  Срочность {getSortIcon("urgency")}
                </div>
              </TableHead>
              <TableHead
                className="text-[#6C6C6E] cursor-pointer hover:bg-blue-200 transition"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center gap-1">
                  Дата подачи {getSortIcon("date")}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length > 0 ? (
              sortedData.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-blue-50 transition"
                  onClick={() => handleRowClick(row)}
                >
                  <TableCell className="text-center">{row.number}</TableCell>
                  <TableCell>{row.applicant}</TableCell>
                  <TableCell>{row.urgency}</TableCell>
                  <TableCell>{row.date}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  {isFilterActive ? "Нет данных по выбранному фильтру" : "Нет данных"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {showMoreButton && (
          <Link
            to="/order-log"
            className="text-center text-gray-500 py-2 cursor-pointer hover:underline block"
          >
            Показать больше...
          </Link>
        )}
      </CardContent>

      <OrderModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        data={selectedRow}
        onStatusChange={updateStatus}
      />
    </Card>
  );
};
