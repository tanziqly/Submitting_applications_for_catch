import React, { useState, useMemo } from "react";
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
import { ArrowDownWideNarrow, ArrowUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@shared/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { api } from "@shared/api/axios";

interface TableRowData {
  id: number | string;
  number?: string;
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
}

interface ApplicationsTableProps {
  title: string;
  data: TableRowData[];
  showMoreButton?: boolean;
  maxVisibleRows?: number;
}

type SortField = "sortableNumber" | "applicant" | "urgency" | "date";
type SortDirection = "asc" | "desc";

interface DocumentResponse {
  status: string;
  url: string;
}

const OrderModal: React.FC<{
  open: boolean;
  onClose: () => void;
  data?: TableRowData;
}> = ({ open, onClose, data }) => {
  const [loading, setLoading] = useState(false);
  const [documentError, setDocumentError] = useState<string | null>(null);

  const handleGetDocument = async () => {
  if (!data?.number) {
    setDocumentError("Номер заявки не указан");
    return;
  }

  setLoading(true);
  setDocumentError(null);

  try {
    // Получаем URL для скачивания документа
    const response = await api.get("/requests/download_url", {
      params: {
        number: data.number
      },
      validateStatus: (status) => status < 500
    });

    console.log("📄 Полный ответ сервера:", {
      status: response.status,
      data: response.data,
      headers: response.headers
    });

    // Проверяем успешный статус - РАССЛАБЛЕННАЯ ПРОВЕРКА
    if (response.status === 200) {
      // Вариант 1: Проверяем разные возможные форматы ответа
      let fileUrl = null;
      
      if (response.data.url) {
        fileUrl = response.data.url;
      } else if (response.data.downloadUrl) {
        fileUrl = response.data.downloadUrl;
      } else if (response.data.fileUrl) {
        fileUrl = response.data.fileUrl;
      } else if (typeof response.data === 'string' && response.data.startsWith('http')) {
        fileUrl = response.data;
      }
      
      console.log("🔗 Найденный URL:", fileUrl);

      if (fileUrl) {
        // Открываем в новой вкладке - это более надежно
        console.log("🔄 Открываем документ в новой вкладке...");
        window.open(fileUrl, '_blank');
        
        // Альтернативный способ скачивания
        const downloadLink = document.createElement('a');
        downloadLink.href = fileUrl;
        downloadLink.target = '_blank'; // Открывать в новой вкладке
        downloadLink.rel = 'noopener noreferrer';
        downloadLink.download = `заявка_${data.number}.docx`;
        
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        // Закрываем модальное окно после успешного скачивания
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        console.error("❌ URL не найден в ответе:", response.data);
        setDocumentError("Сервер не вернул ссылку на документ. Формат ответа: " + JSON.stringify(response.data));
      }
    } else if (response.status === 404) {
      setDocumentError("Документ не найден. Возможно, заявка еще не обработана.");
    } else if (response.status === 400) {
      setDocumentError("Неверный номер заявки");
    } else {
      setDocumentError(`Сервер вернул статус: ${response.status}`);
    }
  } catch (error: any) {
    console.error("❌ Ошибка при получении документа:", error);
    
    // Улучшенная обработка ошибок
    if (error.code === "ERR_NETWORK") {
      setDocumentError("Проблемы с подключением к серверу");
    } else if (error.response?.status === 404) {
      setDocumentError("Сервис генерации документов временно недоступен");
    } else if (error.response?.status === 500) {
      setDocumentError("Ошибка на сервере при генерации документа");
    } else if (error.response?.data?.message) {
      // Пытаемся получить сообщение об ошибке из ответа
      try {
        const errorData = typeof error.response.data === 'string' 
          ? JSON.parse(error.response.data) 
          : error.response.data;
        setDocumentError(errorData.message || "Произошла ошибка");
      } catch {
        setDocumentError("Произошла ошибка при обработке запроса");
      }
    } else if (error.message) {
      setDocumentError(error.message);
    } else {
      setDocumentError("Произошла неизвестная ошибка");
    }
  } finally {
    setLoading(false);
  }
}

  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl p-6 w-full max-w-[450px] shadow-lg relative">
        <button
          className="absolute text-4xl cursor-pointer top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-2xl font-semibold mb-4">Заявка {data.number}</h2>
        
        {/* Сообщение об ошибке */}
        {documentError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-red-800 text-sm">{documentError}</div>
          </div>
        )}

        <div className="space-y-2 mb-4">
          <div>
            <b>Адрес:</b> {data.address || "-"}
          </div>
          <div>
            <b>Количество собак:</b> {data.dogsCount ?? data.quantity ?? "-"}
          </div>
          <div>
            <b>Поведение:</b> {data.behavior || "-"}
          </div>
          <div>
            <b>Срочность:</b> {data.urgency}
          </div>
          <div>
            <b>Имя заявителя:</b> {data.applicantName || data.applicant}
          </div>
          <div>
            <b>Сведения о заявителе:</b>{" "}
            {data.source?.name || data.applicantInfo || "-"}
          </div>
          <div>
            <b>Контактное лицо:</b> {data.contactPerson || "-"}
          </div>
          <div>
            <b>Статус:</b> {data.status || "-"}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Изменить статус
          </Button>
          <Button
            variant="outline"
            className="bg-neutral-300 hover:bg-neutral-400 border-none flex-1"
            onClick={handleGetDocument}
            disabled={loading || !data.number}
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
      </div>
    </div>
  );
};

const ApplicationsTable: React.FC<ApplicationsTableProps> = ({
  title,
  data,
  showMoreButton = false,
  maxVisibleRows,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<TableRowData | undefined>();
  const [sortField, setSortField] = useState<SortField>("sortableNumber");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Добавляем числовое поле для сортировки по номеру
  const processedData = useMemo(() => {
    return data.map((item, index) => ({
      ...item,
      sortableNumber: extractNumberFromString(item.number) || index + 1,
    }));
  }, [data]);

  // Функция для извлечения числа из строки номера
  function extractNumberFromString(str?: string): number {
    if (!str) return 0;

    // Убираем "№" и другие нечисловые символы, оставляем только цифры
    const numbers = str.replace(/[^\d]/g, "");
    return numbers ? parseInt(numbers, 10) : 0;
  }

  // Функция для сортировки данных
  const sortedData = useMemo(() => {
    const sorted = [...processedData].sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      // Для дат преобразуем в timestamp для корректной сортировки
      if (sortField === "date") {
        aValue = new Date(aValue.split(".").reverse().join("-")).getTime();
        bValue = new Date(bValue.split(".").reverse().join("-")).getTime();
      }

      // Для строк приводим к нижнему регистру для case-insensitive сортировки
      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });

    return maxVisibleRows ? sorted.slice(0, maxVisibleRows) : sorted;
  }, [processedData, sortField, sortDirection, maxVisibleRows]);

  const handleRowClick = (row: TableRowData) => {
    setSelectedRow(row);
    setModalOpen(true);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Если уже сортируем по этому полю, меняем направление
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Если новое поле, устанавливаем его и направление по умолчанию
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

  return (
    <Card className="border-none w-full shadow-none">
      <CardHeader className="w-full">
        <div className="flex items-center justify-between w-full">
          <CardTitle className="text-xl font-medium">{title}</CardTitle>
          {!showMoreButton && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="rounded-sm gap-2 flex items-center"
                  variant="outline"
                >
                  <span>Сортировать</span>
                  <ArrowDownWideNarrow size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleSort("sortableNumber")}>
                  <span className="flex items-center gap-2">
                    По номеру {getSortIcon("sortableNumber")}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("applicant")}>
                  <span className="flex items-center gap-2">
                    По заявителю {getSortIcon("applicant")}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("urgency")}>
                  <span className="flex items-center gap-2">
                    По срочности {getSortIcon("urgency")}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("date")}>
                  <span className="flex items-center gap-2">
                    По дате {getSortIcon("date")}
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
            {sortedData.map((row) => (
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
            ))}
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
      />
    </Card>
  );
};

export default ApplicationsTable;