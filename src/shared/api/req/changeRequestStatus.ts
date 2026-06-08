import { api } from "../axios";

interface ChangeStatusRequest {
  id: string;
  status: "Новая" | "В работе" | "Выполнена" | "Отменена";
}

export const changeRequestStatus = async ({
  id,
  status,
}: ChangeStatusRequest): Promise<void> => {
  await api.put("/requests/status", { id, status });
};
