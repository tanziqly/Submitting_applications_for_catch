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
};

export const Application = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const {
    loading,
    submitError,
    submitSuccess,
    formData,
    handleInputChange,
    handleSelectChange,
    handleSubmit: originalHandleSubmit,
    handleClear,
  } = useHandleSubmit(initialFormData);

  // Функция для показа подтверждения
  const handleSubmitClick = () => {
    // Проверяем обязательные поля перед показом модального окна
    if (
      !formData.address ||
      !formData.applicant.id ||
      !formData.contact_person ||
      !formData.behavior ||
      !formData.urgency ||
      formData.dogs_count <= 0
    ) {
      alert("Заполните все обязательные поля");
      return;
    }
    setShowConfirmation(true);
  };

  // Функция подтверждения отправки
  const handleConfirmSubmit = async () => {
    await originalHandleSubmit();
    setShowConfirmation(false);
  };

  // Функция отмены отправки
  const handleCancelSubmit = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="sm:h-screen h-full mt-20 sm:mt-0 flex justify-center w-full sm:items-center px-4">
      <div className="w-[1050px] mx-auto p-6 border-1 border-gray-300 rounded-xl bg-white">
        {/* Сообщения об ошибках/успехе */}
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
              // disabled={loading}
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
              // disabled={loading}
            />

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
              disabled={loading}
            />

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
              disabled={loading}
            />
          </div>

          {/* Правая колонка */}
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
              value={formData.applicant.id || ""}
              onValueChange={handleSelectChange("applicant")}
              disabled={loading}
            />

            <Label>
              <FileUser className="h-5 w-5" /> Сведения о заявителе
            </Label>
            <Select
              placeholder="Выберите сведения о заявителе"
              items={SourceOptions}
              value={formData.source.id || ""}
              onValueChange={handleSelectChange("source")}
              disabled={loading}
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
              // disabled={loading}
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
            disabled={loading}
          >
            Очистить форму
          </Button>
          <Button
            variant={"cube"}
            size={"default"}
            color="default"
            className="flex-1"
            onClick={handleSubmitClick}
            disabled={loading}
          >
            {loading ? "Отправка..." : "Подать заявку"}
          </Button>
        </div>
      </div>

      {/* Модальное окно подтверждения из shadcn */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Подтверждение отправки
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">
              Вы уверены, что хотите отправить заявку? Проверьте правильность
              введенных данных.
            </p>
          </div>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button
              className="w-[125px]"
              variant="cube"
              color="grey"
              onClick={handleCancelSubmit}
              disabled={loading}
            >
              Отмена
            </Button>
            <Button
              className="w-[125px]"
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
