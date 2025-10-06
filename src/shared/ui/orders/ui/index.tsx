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
import { ArrowDownWideNarrow, ArrowUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@shared/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { api } from "@shared/api/axios";
import { changeRequestStatus } from "@shared/api/req/changeRequestStatus";

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

interface OrderModalProps {
  open: boolean;
  onClose: () => void;
  data?: TableRowData;
  onStatusChange?: (id: string | number, newStatus: string) => void;
}

type SortField = "sortableNumber" | "applicant" | "urgency" | "date";
type SortDirection = "asc" | "desc";

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
      await changeRequestStatus({
        id: String(localData.id),
        status: newStatus as "новая" | "в работе" | "выполнена" | "отменена",
      });

      // Обновляем локальные данные сразу
      setLocalData((prev) => (prev ? { ...prev, status: newStatus } : prev));

      // Обновляем статус в таблице сразу после успешного запроса
      onStatusChange?.(localData.id, newStatus);

      setIsStatusEditMode(false);
    } catch (err) {
      console.error("Ошибка при обновлении статуса:", err);
      // Можно добавить уведомление пользователю
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
            {["новая", "в работе", "выполнена", "отменена"].map((status) => (
              <Button
                key={status}
                variant="outline"
                className="w-full bg-neutral-200 uppercase hover:bg-neutral-300 hover:text-black border-none text-black"
                onClick={() => updateStatus(status)}
                disabled={loading}
              >
                {status}
              </Button>
            ))}
            <Button
              variant="ghost"
              className="w-full text-white hover:bg-blue-700 hover:text-white mt-4"
              onClick={() => setIsStatusEditMode(false)}
              disabled={loading}
            >
              Вернуться назад
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
              {/* Другие кнопки, если нужны */}
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

const ApplicationsTable: React.FC<ApplicationsTableProps> = ({
  title,
  data,
  showMoreButton = false,
  maxVisibleRows,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<string | number | null>(
    null
  );
  const [sortField, setSortField] = useState<SortField>("sortableNumber");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const [tableData, setTableData] = useState<TableRowData[]>(data);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const extractNumberFromString = (str?: string): number => {
    if (!str) return 0;
    const numbers = str.replace(/[^\d]/g, "");
    return numbers ? parseInt(numbers, 10) : 0;
  };

  const processedData = useMemo(() => {
    return tableData.map((item, index) => ({
      ...item,
      sortableNumber: extractNumberFromString(item.number) || index + 1,
    }));
  }, [tableData]);

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

  // Функция для обновления статуса в локальном состоянии таблицы
  const updateStatus = (id: string | number, newStatus: string) => {
    setTableData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  };

  // Выбираем актуальные данные для модалки из состояния таблицы
  const selectedRow = selectedRowId
    ? tableData.find((item) => item.id === selectedRowId)
    : undefined;

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

      {/* Передаем updateStatus для обновления статуса заявки */}
      <OrderModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        data={selectedRow}
        onStatusChange={updateStatus}
      />
    </Card>
  );
};

export default ApplicationsTable;
