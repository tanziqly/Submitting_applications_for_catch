import { useState, useEffect } from "react";
import { getRequests } from "@features/request/hooks/useRequestsLog";
import type { Request } from "@features/request/hooks/useRequestsLog";

export interface DashboardStats {
  total: number;
  new: number;
  inProgress: number;
  completed: number;
}

export interface ChartData {
  name: string;
  value: number;
}

// Функция для получения ID заявителя из заявки
const getApplicantId = (request: Request): string => {
  if (!request) return '';
  
  if (typeof request.applicant === 'string') {
    return request.applicant;
  } else if (request.applicant && typeof request.applicant === 'object') {
    if ('id' in request.applicant) {
      return request.applicant.id;
    } else if ('value' in request.applicant) {
      return request.applicant;
    }
  }
  return '';
};

export const useDashboardData = (department?: string) => {
  const [allRequests, setAllRequests] = useState<Request[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    new: 0,
    inProgress: 0,
    completed: 0,
  });
  const [chartData, setChartData] = useState<ChartData[]>([]);

  // Функция для фильтрации заявок по отделу
  const filterRequestsByDepartment = (requests: Request[], department?: string): Request[] => {
    if (!department) {
      return requests;
    }
    
    return requests.filter(request => {
      const applicantId = getApplicantId(request);
      return applicantId === department;
    });
  };

  const calculateStats = (data: Request[]) => {
    const stats: DashboardStats = {
      total: data.length,
      new: data.filter(
        (request) => request.status === "Новая"
      ).length,
      inProgress: data.filter(
        (request) => request.status === "В работе"
      ).length,
      completed: data.filter(
        (request) => request.status === "Выполнена"
      ).length,
    };
    setStats(stats);
  };

  const generateChartData = (data: Request[]) => {
    const last10Days = Array.from({ length: 10 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toLocaleDateString("ru-RU");
    }).reverse();

    const chartData = last10Days.map((date) => {
      const count = data.filter((request) => {
        const requestDate = new Date(request.created_at).toLocaleDateString(
          "ru-RU"
        );
        return requestDate === date;
      }).length;

      return {
        name: date,
        value: count,
      };
    });

    setChartData(chartData);
  };

  // При изменении department фильтруем заявки
  useEffect(() => {
    const filtered = filterRequestsByDepartment(allRequests, department);
    setFilteredRequests(filtered);
    
    // Пересчитываем статистику и график для отфильтрованных данных
    calculateStats(filtered);
    generateChartData(filtered);
  }, [department, allRequests]);

  // Первоначальная загрузка данных
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getRequests();
        setAllRequests(data);
        
        // Фильтруем данные при первоначальной загрузке
        const filtered = filterRequestsByDepartment(data, department);
        setFilteredRequests(filtered);
        calculateStats(filtered);
        generateChartData(filtered);
        
        setError(null);
      } catch (err: any) {
        console.error("Ошибка при загрузке данных:", err);
        setError("Произошла ошибка при загрузке данных");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    requests: filteredRequests, // Возвращаем отфильтрованные заявки
    loading,
    error,
    stats,
    chartData,
  };
};