import { api } from "../axios";

interface ChangeStatusRequest {
  id: string;
  status: "новая" | "в работе" | "выполнена" | "отменена";
}

export const changeRequestStatus = async ({
  id,
  status,
}: ChangeStatusRequest): Promise<void> => {
  await api.post("/requests/change-status", { id, status });
};
