import React, { useState } from "react";
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
import { ArrowDownWideNarrow } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@shared/ui/dropdown-menu";
interface TableRowData {
  id: number;
  applicant: string;
  urgency: string;
  date: string;
  address?: string;
  quantity?: number;
  behavior?: string;
  applicantName?: string;
  applicantInfo?: string;
  contactPerson?: string;
  status?: string;
}
interface ApplicationsTableProps {
  title: string;
  data: TableRowData[];
  showMoreButton?: boolean;
  maxVisibleRows?: number;
}
const OrderModal: React.FC<{
  open: boolean;
  onClose: () => void;
  data?: TableRowData;
}> = ({ open, onClose, data }) => {
  if (!open || !data) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      {" "}
      <div className="bg-white rounded-xl p-6 w-full max-w-[350px] shadow-lg relative">
        {" "}
        <button
          className="absolute text-4xl cursor-pointer top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          {" "}
          ×{" "}
        </button>{" "}
        <h2 className="text-2xl font-semibold mb-4">Заявка №{data.id}</h2>{" "}
        <div className="space-y-2 mb-4">
          {" "}
          <div>
            {" "}
            <b>Адрес:</b> {data.address || "-"}{" "}
          </div>{" "}
          <div>
            {" "}
            <b>Количество:</b> {data.quantity ?? "-"}{" "}
          </div>{" "}
          <div>
            {" "}
            <b>Поведение:</b> {data.behavior || "-"}{" "}
          </div>{" "}
          <div>
            {" "}
            <b>Срочность:</b> {data.urgency}{" "}
          </div>{" "}
          <div>
            {" "}
            <b>Имя заявителя:</b> {data.applicantName || data.applicant}{" "}
          </div>{" "}
          <div>
            {" "}
            <b>Сведения о заявителе:</b> {data.applicantInfo || "-"}{" "}
          </div>{" "}
          <div>
            {" "}
            <b>Контактное лицо:</b> {data.contactPerson || "-"}{" "}
          </div>{" "}
          <div>
            {" "}
            <b>Статус:</b> {data.status || "-"}{" "}
          </div>{" "}
        </div>{" "}
        <div className="flex flex-col gap-2">
          {" "}
          <Button variant="outline" className="flex-1" onClick={onClose}>
            {" "}
            Изменить статус{" "}
          </Button>{" "}
          <Button
            variant="outline"
            className="bg-neutral-300 hover:text-neutral-300 border-none flex-1"
          >
            {" "}
            Отменить{" "}
          </Button>{" "}
          <Button
            variant="outline"
            className="flex-1 bg-white hover:text-neutral-300 border-neutral-300 text-neutral-300"
            onClick={onClose}
          >
            {" "}
            Закрыть{" "}
          </Button>{" "}
        </div>{" "}
      </div>{" "}
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
  const displayedData = maxVisibleRows ? data.slice(0, maxVisibleRows) : data;
  const handleRowClick = (row: TableRowData) => {
    setSelectedRow(row);
    setModalOpen(true);
  };
  return (
    <Card className="border-none shadow-none">
      {" "}
      <CardHeader>
        {" "}
        <div className="flex items-center justify-between w-full">
          {" "}
          <CardTitle className="text-xl font-medium">{title}</CardTitle>{" "}
          {!showMoreButton && (
            <DropdownMenu>
              {" "}
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
                {" "}
                <DropdownMenuItem>По номеру</DropdownMenuItem>{" "}
                <DropdownMenuItem>По заявителю</DropdownMenuItem>{" "}
                <DropdownMenuItem>По срочности</DropdownMenuItem>{" "}
                <DropdownMenuItem>По дате</DropdownMenuItem>{" "}
              </DropdownMenuContent>{" "}
            </DropdownMenu>
          )}{" "}
        </div>{" "}
      </CardHeader>{" "}
      <CardContent>
        {" "}
        <Table>
          {" "}
          <TableHeader>
            {" "}
            <TableRow className="bg-[#CADDFF]">
              {" "}
              <TableHead className="text-center text-[#6C6C6E] rounded-l-xl">
                {" "}
                Номер заявки{" "}
              </TableHead>{" "}
              <TableHead className="text-[#6C6C6E]">Заявитель</TableHead>{" "}
              <TableHead className="text-[#6C6C6E]">Срочность</TableHead>{" "}
              <TableHead className="text-[#6C6C6E] rounded-r-xl">
                {" "}
                Дата подачи{" "}
              </TableHead>{" "}
            </TableRow>{" "}
          </TableHeader>{" "}
          <TableBody>
            {" "}
            {displayedData.map((row) => (
              <TableRow
                key={row.id}
                className="cursor-pointer hover:bg-blue-50 transition"
                onClick={() => handleRowClick(row)}
              >
                {" "}
                <TableCell className="text-center">{row.id}</TableCell>{" "}
                <TableCell>{row.applicant}</TableCell>{" "}
                <TableCell>{row.urgency}</TableCell>{" "}
                <TableCell>{row.date}</TableCell>{" "}
              </TableRow>
            ))}{" "}
          </TableBody>{" "}
        </Table>{" "}
        {showMoreButton && (
          <Link
            to="/order-log"
            className="text-center text-gray-500 py-2 cursor-pointer hover:underline"
          >
            {" "}
            Показать больше...{" "}
          </Link>
        )}{" "}
      </CardContent>{" "}
      <OrderModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        data={selectedRow}
      />{" "}
    </Card>
  );
};
export default ApplicationsTable;
