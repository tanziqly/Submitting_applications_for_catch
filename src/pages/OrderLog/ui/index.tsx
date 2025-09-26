import { ApplicationsTable } from "@shared/ui/orders";
import { Sidebar } from "@shared/ui/sidebar";
import { ClipboardPlus } from "lucide-react";
import { Link } from "react-router-dom";

const tableData = [
  {
    id: 1,
    applicant: "- Глава администрации Васильевского сельсовета",
    urgency: "Срочно",
    date: "21.07.2025",
  },
  {
    id: 2,
    applicant: "- Глава администрации Васильевского сельсовета",
    urgency: "Срочно",
    date: "21.07.2025",
  },
  {
    id: 3,
    applicant: "- Глава администрации Васильевского сельсовета",
    urgency: "Срочно",
    date: "21.07.2025",
  },
  {
    id: 4,
    applicant: "- Глава администрации Васильевского сельсовета",
    urgency: "Срочно",
    date: "21.07.2025",
  },
  {
    id: 5,
    applicant: "- Глава администрации Васильевского сельсовета",
    urgency: "Срочно",
    date: "21.07.2025",
  },
  {
    id: 5,
    applicant: "- Глава администрации Васильевского сельсовета",
    urgency: "Срочно",
    date: "21.07.2025",
  },
  {
    id: 5,
    applicant: "- Глава администрации Васильевского сельсовета",
    urgency: "Срочно",
    date: "21.07.2025",
  },
  {
    id: 5,
    applicant: "- Глава администрации Васильевского сельсовета",
    urgency: "Срочно",
    date: "21.07.2025",
  },
  {
    id: 5,
    applicant: "- Глава администрации Васильевского сельсовета",
    urgency: "Срочно",
    date: "21.07.2025",
  },
];

export const OrderLog = () => {
  return (
    <div className="flex min-h-screen w-full max-w-[1440px] mt-20 bg-white">
      {/* Сайдбар */}
      <Sidebar />

      {/* Контент */}
      <main className="flex-1 border-l border-gray-200 px-6 space-y-6">
        {/* Таблица */}
        <ApplicationsTable
          title={"Все заявки"}
          data={tableData}
          showMoreButton={false}
        />
      </main>
    </div>
  );
};
