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
  AlertCircle,
} from "lucide-react";
import { Select } from "@shared/ui/dropdown";
import { Label } from "@shared/ui/label";
import { useHandleSubmit } from "@features/request/hooks/useHandleSubmit";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@shared/ui/dialog";
import { Loader2 } from "lucide-react";
import { SourceOptions, ApplicantOptions } from "@shared/config/selectOptions";

const initialFormData = {
  address: "",
  applicant: { id: "" },
  behavior: "",
  contact_person: "",
  dogs_count: 0,
  urgency: "",
  source: { id: "" },
};

type ValidationErrors = {
  address?: string;
  dogs_count?: string;
  behavior?: string;
  urgency?: string;
  contact_person?: string;
  applicant?: string;
  source?: string;
};

// Типы для данных
type ApplicantItem = {
  id: string;
  name: string;
  is_permanent?: boolean;
};

type SourceItem = {
  id: string;
  name: string;
  is_permanent?: boolean;
};

export const Application = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Состояния для данных
  const [applicants, setApplicants] = useState<ApplicantItem[]>([]);
  const [sources, setSources] = useState<SourceItem[]>([]);
  const [loadingData, setLoadingData] = useState({
    applicants: true,
    sources: true,
  });
  const [dataError, setDataError] = useState<string | null>(null);

  const {
    loading,
    submitSuccess,
    formData,
    handleInputChange,
    handleSelectChange,
    handleSubmit: originalHandleSubmit,
    handleClear,
  } = useHandleSubmit(initialFormData);

  const [errors, setErrors] = useState<ValidationErrors>({});

  // Загрузка статических данных из конфига
  useEffect(() => {
    console.log("Использование статических данных из config");

    // Преобразуем статические данные в нужный формат
    const formattedApplicants = ApplicantOptions.map((option) => ({
      id: option.value,
      name: option.label,
      is_permanent: true,
    }));

    const formattedSources = SourceOptions.map((option) => ({
      id: option.value,
      name: option.label,
      is_permanent: true,
    }));

    setApplicants(formattedApplicants);
    setSources(formattedSources);
    setLoadingData({ applicants: false, sources: false });
    setDataError(null);
  }, []);

  // Преобразование данных в формат для Select
  const applicantOptions = applicants.map((applicant) => ({
    label: applicant.name || "Без названия",
    value: applicant.id,
  }));

  const sourceOptions = sources.map((source) => ({
    label: source.name || "Без названия",
    value: source.id,
  }));

  // ----------------- ВАЛИДАЦИЯ -----------------
  const validateField = (field: string, value: any) => {
    switch (field) {
      case "address":
        return value ? "" : "Введите адрес";
      case "dogs_count":
        return value > 0 ? "" : "Количество должно быть больше 0";
      case "behavior":
        return value ? "" : "Выберите поведение";
      case "urgency":
        return value ? "" : "Выберите срочность";
      case "contact_person":
        return value ? "" : "Введите контактное лицо";
      case "applicant":
        return value.id ? "" : "Выберите заявителя";
      case "source":
        return value.id ? "" : "Выберите сведения о заявителе";
      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors = {
      address: validateField("address", formData.address),
      dogs_count: validateField("dogs_count", formData.dogs_count),
      behavior: validateField("behavior", formData.behavior),
      urgency: validateField("urgency", formData.urgency),
      contact_person: validateField("contact_person", formData.contact_person),
      applicant: validateField("applicant", formData.applicant),
      source: validateField("source", formData.source),
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  // ----------------- ПОДТВЕРЖДЕНИЕ -----------------
  const handleSubmitClick = () => {
    if (!validateForm()) return;
    setShowConfirmation(true);
  };

  const handleConfirmSubmit = async () => {
    await originalHandleSubmit();
    setShowConfirmation(false);
  };

  // Проверяем, загружены ли данные
  const isDataLoaded = !loadingData.applicants && !loadingData.sources;
  const hasApplicants = applicantOptions.length > 0;
  const hasSources = sourceOptions.length > 0;

  return (
    <div className="sm:h-screen h-full mt-20 sm:mt-0 flex justify-center w-full sm:items-center px-4">
      <div className="w-[1050px] mx-auto p-6 border-1 border-gray-300 rounded-xl bg-white">
        {/* Сообщения об ошибках загрузки */}
        {dataError && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-yellow-800 font-medium">Внимание</div>
              <div className="text-yellow-600 mt-1">{dataError}</div>
              <div className="text-yellow-600 text-sm mt-1">
                Проверьте консоль для подробностей
              </div>
            </div>
          </div>
        )}

        {!isDataLoaded && !dataError && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
            <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
            <div className="text-blue-800">Загрузка данных...</div>
          </div>
        )}

        {isDataLoaded && (!hasApplicants || !hasSources) && !dataError && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-yellow-800 font-medium">Данные не найдены</div>
            <div className="text-yellow-600 mt-1">
              {!hasApplicants && "Список заявителей пуст"}
              {!hasApplicants && !hasSources && ", "}
              {!hasSources && "Список источников пуст"}
            </div>
          </div>
        )}

        {submitSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-green-800 font-medium">Успешно!</div>
            <div className="text-green-600 mt-1">Заявка успешно отправлена</div>
          </div>
        )}

        <h2 className="text-lg font-semibold flex items-center gap-2 mb-1">
          <ClipboardPlus /> Подача заявки
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          * Заполните все поля для подачи заявки
        </p>

        <div className="flex flex-col md:flex-row gap-8">
          {/* ЛЕВАЯ КОЛОНКА */}
          <div className="flex-1 flex flex-col gap-4">
            <h3 className="font-semibold text-sm mb-2">Информация о безнадзорных животных</h3>

            <InputWithLabel
              icon={<MapPin className="h-5 w-5" />}
              label="Адрес"
              id="address"
              type="text"
              placeholder="Введите адрес"
              required
              value={formData.address}
              onChange={(e) => {
                handleInputChange("address", e.target.value);
                setErrors({
                  ...errors,
                  address: validateField("address", e.target.value),
                });
              }}
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address}</p>
            )}

            <InputWithLabel
              icon={<RectangleEllipsis className="h-5 w-5" />}
              label="Количество"
              id="count"
              type="number"
              placeholder="Введите количество"
              required
              value={formData.dogs_count}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 0;
                handleInputChange("dogs_count", value);
                setErrors({
                  ...errors,
                  dogs_count: validateField("dogs_count", value),
                });
              }}
            />
            {errors.dogs_count && (
              <p className="text-red-500 text-sm">{errors.dogs_count}</p>
            )}

            <Label>
              <Smile className="h-5 w-5" /> Поведение
            </Label>
            <Select
              placeholder="Выберите поведение"
              items={[
                { label: "Агрессивное", value: "Агрессивное" },
                { label: "Неагрессивное", value: "Неагрессивное" },
              ]}
              value={formData.behavior}
              onValueChange={(v) => {
                handleSelectChange("behavior")(v);
                setErrors({
                  ...errors,
                  behavior: validateField("behavior", v),
                });
              }}
              disabled={loading || !isDataLoaded}
            />
            {errors.behavior && (
              <p className="text-red-500 text-sm">{errors.behavior}</p>
            )}

            <Label>
              <Clock className="h-5 w-5" /> Срочность
            </Label>
            <Select
              placeholder="Выберите срочность"
              items={[
                { label: "Срочно", value: "Срочно" },
                { label: "Не срочно", value: "Не срочно" },
              ]}
              value={formData.urgency}
              onValueChange={(v) => {
                handleSelectChange("urgency")(v);
                setErrors({ ...errors, urgency: validateField("urgency", v) });
              }}
              disabled={loading || !isDataLoaded}
            />
            {errors.urgency && (
              <p className="text-red-500 text-sm">{errors.urgency}</p>
            )}
          </div>

          {/* ПРАВАЯ КОЛОНКА */}
          <div className="flex-1 flex flex-col gap-4">
            <h3 className="font-semibold text-sm mb-2">
              Информация о заявителе
            </h3>

            <Label>
              <UserRound className="h-5 w-5" /> Заявитель
            </Label>
            <div className="relative">
              <Select
                placeholder={
                  loadingData.applicants
                    ? "Загрузка..."
                    : hasApplicants
                      ? "Выберите заявителя"
                      : "Нет данных"
                }
                items={applicantOptions}
                value={formData.applicant.id}
                onValueChange={(v) => {
                  handleSelectChange("applicant")(v);
                  setErrors({
                    ...errors,
                    applicant: validateField("applicant", { id: v }),
                  });
                }}
                disabled={loading || loadingData.applicants || !hasApplicants}
              />
              {loadingData.applicants && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                </div>
              )}
            </div>
            {errors.applicant && (
              <p className="text-red-500 text-sm">{errors.applicant}</p>
            )}

            <Label>
              <FileUser className="h-5 w-5" /> Сведения о заявителе
            </Label>
            <div className="relative">
              <Select
                placeholder={
                  loadingData.sources
                    ? "Загрузка..."
                    : hasSources
                      ? "Выберите сведения о заявителе"
                      : "Нет данных"
                }
                items={sourceOptions}
                value={formData.source.id}
                onValueChange={(v) => {
                  handleSelectChange("source")(v);
                  setErrors({
                    ...errors,
                    source: validateField("source", { id: v }),
                  });
                }}
                disabled={loading || loadingData.sources || !hasSources}
              />
              {loadingData.sources && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                </div>
              )}
            </div>
            {errors.source && (
              <p className="text-red-500 text-sm">{errors.source}</p>
            )}

            <InputWithLabel
              icon={<Contact className="h-5 w-5" />}
              label="Контактное лицо"
              id="contact"
              type="text"
              placeholder="Введите контактное лицо"
              required
              value={formData.contact_person}
              onChange={(e) => {
                handleInputChange("contact_person", e.target.value);
                setErrors({
                  ...errors,
                  contact_person: validateField(
                    "contact_person",
                    e.target.value,
                  ),
                });
              }}
            />
            {errors.contact_person && (
              <p className="text-red-500 text-sm">{errors.contact_person}</p>
            )}
          </div>
        </div>

        {/* КНОПКИ */}
        <div className="flex items-center mt-6 w-full gap-6">
          <Button
            variant="cube"
            color="grey"
            className="flex-1"
            onClick={handleClear}
            disabled={loading || !isDataLoaded}
          >
            Очистить форму
          </Button>

          <Button
            variant="cube"
            color="default"
            className="flex-1"
            onClick={handleSubmitClick}
            disabled={
              loading ||
              !isDataLoaded ||
              !hasApplicants ||
              !hasSources
            }
          >
            {loading ? "Отправка..." : "Подать заявку"}
          </Button>
        </div>
      </div>

      {/* МОДАЛКА */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Подтверждение отправки
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">
              Вы уверены, что хотите отправить заявку? Проверьте введённые
              данные.
            </p>
          </div>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button
              variant="cube"
              color="grey"
              onClick={() => setShowConfirmation(false)}
            >
              Отмена
            </Button>
            <Button
              variant="cube"
              color="default"
              onClick={handleConfirmSubmit}
              disabled={loading}
            >
              {loading ? "Отправка..." : "Продолжить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
