import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@shared/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@shared/ui/table";

interface TableRowData {
  id: number;
  applicant: string;
  urgency: string;
  date: string;
}

interface ApplicationsTableProps {
  title: string;
  data: TableRowData[];
  showMoreButton?: boolean;
  maxVisibleRows?: number;
}

const ApplicationsTable: React.FC<ApplicationsTableProps> = ({
  title,
  data,
  showMoreButton = false,
  maxVisibleRows,
}) => {
  const displayedData = maxVisibleRows ? data.slice(0, maxVisibleRows) : data;

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-xl font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-[#CADDFF]">
              <TableHead className="text-center text-[#6C6C6E] rounded-l-xl">
                Номер заявки
              </TableHead>
              <TableHead className="text-[#6C6C6E]">Заявитель</TableHead>
              <TableHead className="text-[#6C6C6E]">Срочность</TableHead>
              <TableHead className="text-[#6C6C6E] rounded-r-xl">
                Дата подачи
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedData.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="text-center">{row.id}</TableCell>
                <TableCell>{row.applicant}</TableCell>
                <TableCell>{row.urgency}</TableCell>
                <TableCell>{row.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {showMoreButton && (
          <div className="text-center text-gray-500 py-2 cursor-pointer hover:underline">
            Показать больше...
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApplicationsTable;
