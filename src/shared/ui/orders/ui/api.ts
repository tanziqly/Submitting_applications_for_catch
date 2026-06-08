// shared/ui/orders/ui/api.ts

import { api } from "@shared/api/axios";
import type {
  ChangeStatusRequest,
  UploadActRequest,
  UploadResponse,
} from "./types";

export const changeRequestStatus = async (
  request: ChangeStatusRequest
): Promise<void> => {
  const response = await api.put("/requests/status", request);
  return response.data;
};

// Функция для получения акта НА отлов (документ для работы)
export const getCatchActDocument = async (
  requestId: string
): Promise<string> => {
  const response = await api.post(
    "/generate",
    { requests_ids: [requestId] },
    { responseType: "blob" }
  );

  const blob = new Blob([response.data], {
    type: response.headers["content-type"] || "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  return url;
};

// Функция для получения готового акта отлова (выполненная работа)
export const getCompletedActDocument = async (
  filename: string
): Promise<string> => {
  const response = await api.get(`/requests/act/${filename}`);

  if (response.status === 200 && response.data.url) {
    return response.data.url;
  } else {
    throw new Error("Не удалось получить акт отлова");
  }
};

export const uploadAct = async (
  request: UploadActRequest
): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("request_id", request.id);
  formData.append("file", request.file);

  const response = await api.post("/requests/act", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const completeRequest = async (requestId: string): Promise<void> => {
  try {
    console.log("Изменение статуса заявки на 'Выполнена':", requestId);

    const response = await changeRequestStatus({
      id: requestId,
      status: "Выполнена",
    });

    console.log("Статус успешно изменен:", response);
  } catch (error: any) {
    console.error("Ошибка при изменении статуса:", error);
    throw new Error("Не удалось изменить статус заявки на 'Выполнена'");
  }
};

export const deleteRequest = async (requestId: string): Promise<void> => {
  const response = await api.delete(`/requests/${requestId}`);
  return response.data;
};
