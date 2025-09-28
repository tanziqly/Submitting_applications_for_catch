// shared/api/requests.ts
import { api } from '@shared/api/axios';

export interface Applicant {
  id: string;
  name: string;
}

export interface Source {
  id: string;
  name: string;
}

export interface Request {
  id: string;
  number: string;
  address: string;
  behavior: string;
  contact_person: string;
  created_at: string;
  dogs_count: number;
  status: string;
  urgency: string;
  applicant: Applicant;
  source: Source;
}

export interface ApiError {
  message: string;
  status: string;
}

// Функция для получения всех заявок
export const getRequests = async (): Promise<Request[]> => {
  const response = await api.get<Request[]>('/requests');
  return response.data;
};

// Опционально: функция для получения заявки по ID
export const getRequestById = async (id: string): Promise<Request> => {
  const response = await api.get<Request>(`/requests/${id}`);
  return response.data;
};