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
}

interface ApplicationsTableProps {
  title: string;
  data: TableRowData[];
  showMoreButton?: boolean;
  maxVisibleRows?: number;
}

type SortField = 'number' | 'applicant' | 'urgency' | 'date';
type SortDirection = 'asc' | 'desc';

const OrderModal: React.FC<{
  open: boolean;
  onClose: () => void;
  data?: TableRowData;
}> = ({ open, onClose, data }) => {
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
        <h2 className="text-2xl font-semibold mb-4">Заявка №{data.number}</h2>
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
            <b>Сведения о заявителе:</b> {data.source?.name || data.applicantInfo || "-"}
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
            className="bg-neutral-300 hover:text-neutral-300 border-none flex-1"
          >
            Отменить
          </Button>
          <Button
            variant="outline"
            className="flex-1 bg-white hover:text-neutral-300 border-neutral-300 text-neutral-300"
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
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Функция для сортировки данных
  const sortedData = useMemo(() => {
    const sorted = [...data].sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      // Для дат преобразуем в timestamp для корректной сортировки
      if (sortField === 'date') {
        aValue = new Date(aValue.split('.').reverse().join('-')).getTime();
        bValue = new Date(bValue.split('.').reverse().join('-')).getTime();
      }

      // Для строк приводим к нижнему регистру для case-insensitive сортировки
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return maxVisibleRows ? sorted.slice(0, maxVisibleRows) : sorted;
  }, [data, sortField, sortDirection, maxVisibleRows]);

  const handleRowClick = (row: TableRowData) => {
    setSelectedRow(row);
    setModalOpen(true);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Если уже сортируем по этому полю, меняем направление
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Если новое поле, устанавливаем его и направление по умолчанию
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown size={16} />;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
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
                <DropdownMenuItem onClick={() => handleSort('number')}>
                  <span className="flex items-center gap-2">
                    По номеру {getSortIcon('number')}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('applicant')}>
                  <span className="flex items-center gap-2">
                    По заявителю {getSortIcon('applicant')}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('urgency')}>
                  <span className="flex items-center gap-2">
                    По срочности {getSortIcon('urgency')}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('date')}>
                  <span className="flex items-center gap-2">
                    По дате {getSortIcon('date')}
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
              <TableHead className="text-center text-[#6C6C6E]">
                Номер заявки
              </TableHead>
              <TableHead className="text-[#6C6C6E]">Заявитель</TableHead>
              <TableHead className="text-[#6C6C6E]">Срочность</TableHead>
              <TableHead className="text-[#6C6C6E]">
                Дата подачи
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