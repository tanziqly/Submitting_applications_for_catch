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
import { ApplicantOptions, SourceOptions } from "@shared/config/selectOptions";
import { useHandleSubmit } from "@features/request/hooks/useHandleSubmit";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@shared/ui/dialog";

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

export const Application = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const {
    loading,
    submitError,
    submitSuccess,
    formData,
    customSourceName,
    setCustomSourceName,
    showCustomSource,
    handleInputChange,
    handleSelectChange,
    handleSubmit: originalHandleSubmit,
    handleClear,
    toggleCustomSource,
  } = useHandleSubmit(initialFormData);

  const [errors, setErrors] = useState<ValidationErrors>({});

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
        if (showCustomSource) {
          return customSourceName ? "" : "Введите сведения о заявителе";
        } else {
          return value.id ? "" : "Выберите сведения о заявителе";
        }
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

  const handleSubmitClick = () => {
    if (!validateForm()) return;
    setShowConfirmation(true);
  };

  const handleConfirmSubmit = async () => {
    console.log("Before submit - showCustomSource:", showCustomSource, "customSourceName:", customSourceName, "formData.source.id:", formData.source.id);
    await originalHandleSubmit();
    setShowConfirmation(false);
  };

  const handleToggleCustomSource = () => {
    toggleCustomSource();
    setErrors(prev => ({ ...prev, source: "" }));
  };

  return (
    <div className="sm:h-screen h-full mt-20 sm:mt-0 flex justify-center w-full sm:items-center px-4">
      <div className="w-[1050px] mx-auto p-6 border-1 border-gray-300 rounded-xl bg-white">
        {submitError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-red-800 font-medium">Ошибка отправки</div>
            <div className="text-red-600 mt-1">{submitError}</div>
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
          <div className="flex-1 flex flex-col gap-4">
            <h3 className="font-semibold text-sm mb-2">Информация о собаке</h3>

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
              disabled={loading}
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
              disabled={loading}
            />
            {errors.urgency && (
              <p className="text-red-500 text-sm">{errors.urgency}</p>
            )}
          </div>

          <div className="flex-1 flex flex-col gap-4">
            <h3 className="font-semibold text-sm mb-2">
              Информация о заявителе
            </h3>

            <Label>
              <UserRound className="h-5 w-5" /> Заявитель
            </Label>
            <Select
              placeholder="Выберите заявителя"
              items={ApplicantOptions}
              value={formData.applicant.id}
              onValueChange={(v) => {
                handleSelectChange("applicant")(v);
                setErrors({
                  ...errors,
                  applicant: validateField("applicant", { id: v }),
                });
              }}
              disabled={loading}
            />
            {errors.applicant && (
              <p className="text-red-500 text-sm">{errors.applicant}</p>
            )}

            <div className="flex gap-1 flex-col">
              <Label>
                <FileUser className="h-5 w-5" /> Сведения о заявителе
              </Label>

              <button
                onClick={handleToggleCustomSource}
                className="text-xs text-start text-blue-500 hover:underline cursor-pointer"
              >
                {showCustomSource ? "Выбрать из списка" : "Ввести свои сведения"}
              </button>

              {showCustomSource ? (
                <>
                  <InputWithLabel
                    label=""
                    id="custom_source"
                    type="text"
                    placeholder="Введите сведения о заявителе"
                    value={customSourceName}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCustomSourceName(value);
                      if (value) {
                        setErrors(prev => ({ ...prev, source: "" }));
                      }
                    }}
                  />
                  {errors.source && (
                    <p className="text-red-500 text-sm">{errors.source}</p>
                  )}
                </>
              ) : (
                <>
                  <Select
                    placeholder="Выберите сведения о заявителе"
                    items={SourceOptions}
                    value={formData.source.id}
                    onValueChange={(v) => {
                      handleSelectChange("source")(v);
                      if (v) {
                        setErrors(prev => ({ ...prev, source: "" }));
                      }
                      setErrors({
                        ...errors,
                        source: validateField("source", { id: v }),
                      });
                    }}
                    disabled={loading}
                  />
                  {errors.source && (
                    <p className="text-red-500 text-sm">{errors.source}</p>
                  )}
                </>
              )}
            </div>

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
                    e.target.value
                  ),
                });
              }}
            />
            {errors.contact_person && (
              <p className="text-red-500 text-sm">{errors.contact_person}</p>
            )}
          </div>
        </div>

        <div className="flex items-center mt-6 w-full gap-6">
          <Button
            variant="cube"
            color="grey"
            className="flex-1"
            onClick={handleClear}
          >
            Очистить форму
          </Button>

          <Button
            variant="cube"
            color="default"
            className="flex-1"
            onClick={handleSubmitClick}
            disabled={loading}
          >
            {loading ? "Отправка..." : "Подать заявку"}
          </Button>
        </div>
      </div>

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