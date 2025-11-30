import { useState, useMemo, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@shared/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@shared/ui/table";
import { ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";
import FilterDropdown from "@shared/ui/filter";
import { authStore } from "@features/auth";
import { OrderModal } from "./orderModal";
import { UploadDocumentModal } from "./uploadActModal";
import type {
  TableRowData,
  ApplicationsTableProps,
  SortField,
  SortDirection,
} from "./types";
import { extractNumberFromString, transformFilteredData } from "./utils";
import FilterDropdownInline from "@shared/ui/multiRequest";
import { MultiRequestByIdsButton } from "@shared/ui/multiRequestByIds";

export const ApplicationsTable = ({
  title,
  data,
  showMoreButton = false,
  maxVisibleRows,
  hideCheckboxes = false,
}: ApplicationsTableProps) => {
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<string | number | null>(null);
  const [selectedRequestData, setSelectedRequestData] = useState<TableRowData | null>(null);
  const [sortField, setSortField] = useState<SortField>("sortableNumber");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [tableData, setTableData] = useState<TableRowData[]>(data);
  const [filteredData, setFilteredData] = useState<TableRowData[]>(data);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);

  useEffect(() => {
    setTableData(data);
    setFilteredData(data);
    setIsFilterActive(false);
    setSelectedRows([]);
  }, [data]);

  const handleFilteredData = (filteredRequests: any) => {
    const transformedData = transformFilteredData(filteredRequests);
    console.log("Преобразованные данные:", transformedData);
    setFilteredData(transformedData);
    setIsFilterActive(true);
    setSelectedRows([]);
  };

  const handleFilterLoading = (loading: boolean) => {
    console.log("Filter loading:", loading);
  };

  const handleFilterError = (error: string | null) => {
    if (error) {
      console.error("Filter error:", error);
    }
  };

  const dataToProcess = isFilterActive ? filteredData : tableData;


  // Данные для отображения - сортируем только когда активны фильтры
  const displayData = useMemo(() => {
    const dataToDisplay = isFilterActive ? filteredData : tableData;
    
    // Если фильтры не активны - возвращаем данные как есть с сервера
    if (!isFilterActive) {
      return maxVisibleRows ? dataToDisplay.slice(0, maxVisibleRows) : dataToDisplay;
    }
    
    // Если фильтры активны - применяем сортировку
    const processed = dataToDisplay.map((item) => ({
      ...item,
      sortableNumber: extractNumberFromString(item.number),
    }));

    const sorted = [...processed].sort((a, b) => {
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
  }, [tableData, filteredData, isFilterActive, sortField, sortDirection, maxVisibleRows]);

  const handleDownloadSuccess = (url: string, count: number) => {
    console.log(`Успешно сгенерировано ${count} заявок:`, url);
    // Можно добавить дополнительную логику после успешного скачивания
  };

  const handleDownloadError = (error: string) => {
    console.error("Ошибка при скачивании:", error);
    // Можно показать уведомление об ошибке
  };

  const handleRowClick = (row: TableRowData) => {
    setSelectedRowId(row.id);
    setSelectedRequestData(row);
    setOrderModalOpen(true);
  };

  const handleOpenUploadModal = (requestData: TableRowData) => {
    console.log("handleOpenUploadModal вызван с данными:", requestData);
    setSelectedRequestData(requestData);
    setOrderModalOpen(false);
    setTimeout(() => {
      setUploadModalOpen(true);
    }, 100);
  };

  const handleCloseOrderModal = () => {
    setOrderModalOpen(false);
    setSelectedRowId(null);
  };

  const handleCloseUploadModal = () => {
    setUploadModalOpen(false);
    setSelectedRequestData(null);
  };

  const handleSort = (field: SortField) => {
    // Сортировка работает только когда активны фильтры
    if (!isFilterActive) return;
    
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    // Иконки сортировки показываем только когда активны фильтры
    if (!isFilterActive) return null;
    
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
    if (isFilterActive) {
      setFilteredData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    }
  };

  const handleUploadSuccess = () => {
    console.log("Акт успешно загружен");
    if (selectedRequestData) {
      updateStatus(selectedRequestData.id, "Выполнена");
    }
  };

  const selectedRow = selectedRowId
    ? dataToProcess.find((item) => item.id === selectedRowId)
    : undefined;

  const { user } = authStore;

  const getRowClassName = (status?: string) => {
    const baseClass = "cursor-pointer transition";
    
    switch (status) {
      case "Выполнена":
        return `${baseClass} bg-green-100 hover:bg-green-200`;
      case "Отменена":
        return `${baseClass} bg-gray-100 hover:bg-gray-200`;
      case "Просрочена":
        return `${baseClass} bg-red-100 hover:bg-red-200`;
      case "Новая":
      case "В работе":
      default:
        return `${baseClass} bg-white hover:bg-blue-50`;
    }
  };

  const handleRowSelect = (rowId: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRows(prev => 
      prev.includes(rowId) 
        ? prev.filter(id => id !== rowId)
        : [...prev, rowId]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(displayData.map(row => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  const isAllSelected = displayData.length > 0 && selectedRows.length === displayData.length;
  const isSomeSelected = selectedRows.length > 0 && selectedRows.length < displayData.length;

  // Определяем количество колонок для colSpan
  const columnsCount = hideCheckboxes ? 4 : 5;

  return (
    <Card className="border-none w-full shadow-none">
      <CardHeader className="w-full">
        <div className="flex items-center justify-between w-full">
          <CardTitle className="text-xl font-medium">
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            {/* Все кнопки доступны только для ryaon_comm и podryadchik */}
            {(user?.login === "ryaon_comm" || user?.login === "podryadchik") && (
              <>
                {/* Кнопка скачивания выбранных заявок */}
                {selectedRows.length > 0 && (
                  <MultiRequestByIdsButton
                    selectedIds={selectedRows}
                    onSuccess={handleDownloadSuccess}
                    onError={handleDownloadError}
                  />
                )}
                
                {/* Фильтры - показываются только когда нет выбранных заявок и !showMoreButton */}
                {selectedRows.length === 0 && !showMoreButton && (
                  <div className="flex gap-2">
                    <FilterDropdownInline />
                    <FilterDropdown 
                      onFilteredData={handleFilteredData}
                      onLoading={handleFilterLoading}
                      onError={handleFilterError}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-[#CADDFF]">
              {/* Колонка с чекбоксами - показывается только если hideCheckboxes = false */}
              {!hideCheckboxes && (
                <TableHead className="text-center text-[#6C6C6E] w-12">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={input => {
                      if (input) {
                        input.indeterminate = isSomeSelected;
                      }
                    }}
                    onChange={handleSelectAll}
                    className="w-4 h-4"
                  />
                </TableHead>
              )}
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
            {displayData.length > 0 ? (
              displayData.map((row) => (
                <TableRow
                  key={row.id}
                  className={getRowClassName(row.status)}
                  onClick={() => handleRowClick(row)}
                >
                  {/* Чекбокс в строке - показывается только если hideCheckboxes = false */}
                  {!hideCheckboxes && (
                    <TableCell className="text-center w-12">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row.id)}
                        onChange={(e) => e.stopPropagation()}
                        onClick={(e) => handleRowSelect(row.id, e)}
                        className="w-4 h-4"
                      />
                    </TableCell>
                  )}
                  <TableCell className="text-center">{row.number}</TableCell>
                  <TableCell>{row.applicant}</TableCell>
                  <TableCell>{row.urgency}</TableCell>
                  <TableCell>{row.date}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columnsCount} className="text-center py-8 text-gray-500">
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
        open={orderModalOpen}
        onClose={handleCloseOrderModal}
        data={selectedRow}
        onStatusChange={updateStatus}
        onOpenUploadModal={handleOpenUploadModal}
      />

      <UploadDocumentModal
        open={uploadModalOpen}
        onClose={handleCloseUploadModal}
        requestData={selectedRequestData || undefined}
        onUploadSuccess={handleUploadSuccess}
      />
    </Card>
  );
};