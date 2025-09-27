import { Button } from "@shared/ui/button";
import { InputWithLabel } from "@shared/ui/inputLabel";
import {
  ClipboardPlus,
  MapPin,
  RectangleEllipsis,
  UserRound,
  FileUser,
  Contact,
  Smile,
  Clock,
} from "lucide-react";
import { Select } from "@shared/ui/dropdown";
import { Label } from "@shared/ui/label";
import { useState } from "react";
import { api } from "@shared/api/axios";
import { ApplicantOptions, SourceOptions } from "@shared/config/selectOptions";


interface ApplicationData {
  address: string;
  applicant: {
    id: string;
  };
  behavior: string;
  contact_person: string;
  dogs_count: number;
  urgency: string;
  source: {
    id: string;
  };
}

export const Application = () => {
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [formData, setFormData] = useState<ApplicationData>({
    address: "",
    applicant: {
      id: "",
    },
    behavior: "",
    contact_person: "",
    dogs_count: 0,
    urgency: "",
    source: {
      id: "",
    },
  });

  // Обработчик для текстовых полей
  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Обработчик для селектов
  const handleSelectChange = (field: string) => (selectedValue: string) => {
    if (field === "applicant") {
      setFormData((prev) => ({
        ...prev,
        applicant: {
          id: selectedValue,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: selectedValue,
      }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // Формируем финальный JSON (убираем поля, которые сервер генерирует сам)
      const submissionData = {
        source: {
          id: formData.source.id,
        },
        applicant: {
          id: formData.applicant.id,
        },
        address: formData.address,
        dogs_count: Number(formData.dogs_count),
        behavior: formData.behavior,
        urgency: formData.urgency,
        contact_person: formData.contact_person,
      };

      console.log("Отправка данных на /requests:", submissionData);

      // Отправка на API через ваш axios instance
      const response = await api.post("/requests", submissionData);

      console.log("Успешный ответ от сервера:", response.data);

      setSubmitSuccess(true);
      handleClear();

      // Автоматически скрываем сообщение об успехе через 5 секунд
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error: any) {
      console.error("Ошибка при отправке заявки:", error);

      // Обработка ошибок через ваш interceptor
      if (error.response?.data) {
        // Пытаемся получить сообщение об ошибке от сервера
        const serverError = error.response.data;

        if (typeof serverError === "object") {
          // Если ошибка в формате { field: ["error message"] }
          const errorMessages = Object.values(serverError).flat();
          setSubmitError(
            errorMessages.join(", ") || "Ошибка при отправке заявки"
          );
        } else if (typeof serverError === "string") {
          setSubmitError(serverError);
        } else {
          setSubmitError("Ошибка при отправке заявки. Попробуйте позже.");
        }
      } else {
        setSubmitError(
          error.message ||
            "Произошла ошибка при отправке заявки. Попробуйте позже."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      address: "",
      applicant: {
        id: "",
      },
      behavior: "",
      contact_person: "",
      dogs_count: 0,
      urgency: "",
      source: {
        id: "",
      },
    });
  };

  return (
    <div className="h-screen mt-22 sm:mt-0 flex justify-center w-full items-center px-4">
      <div className="w-[1050px] mx-auto p-6 border-1 border-gray-300 rounded-xl bg-white">
        {/* Заголовок */}
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-1">
          <ClipboardPlus /> Подача заявки
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          * Заполните все поля для подачи заявки
        </p>

        {/* Контент через flex */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Левая колонка */}
          <div className="flex-1 flex flex-col gap-4">
            <h3 className="font-semibold text-sm mb-2">Информация о собаке</h3>

            <InputWithLabel
              icon={<MapPin className="h-5 w-5" />}
              label="Адрес"
              id="address"
              type="text"
              placeholder="Введите адрес"
              required
              value={formData.address || ""}
              onChange={(e) => handleInputChange("address", e.target.value)}
            />

            <InputWithLabel
              icon={<RectangleEllipsis className="h-5 w-5" />}
              label="Количество"
              id="count"
              type="number"
              placeholder="Введите количество"
              required
              value={formData.dogs_count || ""}
              onChange={(e) =>
                handleInputChange("dogs_count", parseInt(e.target.value) || 0)
              }
            />

            {/* <div>
              <label className="block text-sm text-gray-600 mb-1">Поведение</label>
              <select
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring focus:ring-blue-300"
                required
              >
                <option value="aggressive">Агрессивное</option>
                <option value="calm">Спокойное</option>
              </select>
            </div> */}

            <Label>
              <Smile className="h-5 w-5" /> Поведение
            </Label>
            <Select
              placeholder="Выберите поведение"
              items={[
                { label: "Агрессивное", value: "Агрессивное" },
                { label: "Неагрессивное", value: "Неагрессивное" },
              ]}
              value={formData.behavior || ""}
              onValueChange={handleSelectChange("behavior")}
            />

            {/* <div>
              <label className="block text-sm text-gray-600 mb-1">Срочность</label>
              <select
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring focus:ring-blue-300"
                required
              >
                <option value="medium">Срочно</option>
                <option value="high">Не срочно</option>
              </select>
            </div>*/}

            <Label>
              <Clock className="h-5 w-5" /> Срочность
            </Label>
            <Select
              placeholder="Выберите срочность"
              items={[
                { label: "Срочно", value: "Срочно" },
                { label: "Не срочно", value: "Не срочно" },
              ]}
              value={formData.urgency || ""}
              onValueChange={handleSelectChange("urgency")}
            />
          </div>

          {/* Правая колонка */}
          <div className="flex-1 flex flex-col gap-4">
            <h3 className="font-semibold text-sm mb-2">
              Информация о заявителе
            </h3>

            {/* <InputWithLabel
              icon={<UserRound className="h-5 w-5"/>}
              label="Заявитель"
              id="applicant"
              type="text"
              placeholder="Введите заявителя"
              required
            />

            <InputWithLabel
              icon={<FileUser className="h-5 w-5"/>}
              label="Сведения о заявителе"
              id="applicantInfo"
              type="text"
              placeholder="Введите сведения"
            /> */}

            <Label>
              <UserRound className="h-5 w-5" /> Заявитель
            </Label>
            <Select
              placeholder="Выберите заявителя"
              items={ApplicantOptions}
              value={formData.applicant.id || ""}
              onValueChange={handleSelectChange("applicant")}
            />

            <Label>
              <FileUser className="h-5 w-5" /> Сведения о заявителе
            </Label>
            <Select
              placeholder="Выберите сведения о заявителе"
              items={SourceOptions}
              value={formData.source.id || ""}
              onValueChange={handleSelectChange("source")}
            />

            <InputWithLabel
              icon={<Contact className="h-5 w-5" />}
              label="Контактное лицо"
              id="contact"
              type="text"
              placeholder="Введите контактное лицо"
              required
              value={formData.contact_person || ""}
              onChange={(e) =>
                handleInputChange("contact_person", e.target.value)
              }
            />
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex items-center mt-6 w-full gap-6">
          <Button
            variant={"cube"}
            size={"default"}
            color={"grey"}
            className="flex-1"
            onClick={handleClear}
          >
            Очистить форму
          </Button>
          <Button
            variant={"cube"}
            size={"default"}
            color="default"
            className="flex-1"
            onClick={handleSubmit}
          >
            Подать заявку
          </Button>
        </div>
      </div>
    </div>
  );
};
