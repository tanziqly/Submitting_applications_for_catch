import { Button } from "@shared/ui/button";
import { InputWithLabel } from "@shared/ui/inputLabel";
import { ClipboardPlus, MapPin, RectangleEllipsis, UserRound, FileUser, Contact, Smile, Clock } from 'lucide-react';
import { Select } from "@shared/ui/dropdown";
import { Label } from "@shared/ui/label";
import { useState } from "react";
import { api } from "@shared/api/axios";

const applicantOptions = [
    { label: "Глава администрации Введенского сельсовета", value: "0a12fc83-2199-4bae-88cf-752c923ecf07" },
    { label: "Глава администрации Сырского сельсовета", value: "22c62055-a734-42bb-b00c-880ebac52ca3" },
    { label: "Глава администрации Ленинского сельсовета", value: "24ad454b-d337-4ff7-80ac-9d6af7d0f9d3" },
    { label: "Глава администрации Косыревского сельсовета", value: "3a84b4ad-1b82-4c6a-b6ae-7946faefc337" },
    { label: "Глава администрации Васильевского сельсовета", value: "4837c4df-9d00-4883-84b4-45b904bfcfd5" },
    { label: "Глава администрации Круто-Хуторского сельсовета", value: "4854314a-95fc-4685-980a-10a85d16506c" },
    { label: "Глава администрации Тележенского сельсовета", value: "4a6a7f84-fa0f-4500-b025-a54fb3b4b410" },
    { label: "Глава администрации Грязновского сельсовета", value: "4c138f14-44d1-4ceb-a6af-952249b29752" },
    { label: "Глава администрации Большекузьминского сельсовета", value: "552718f6-6fcd-40f3-a802-071f643ee8fe" },
    { label: "Глава администрации Вербиловского сельсовета", value: "6e2bf096-a593-4246-85f0-a5ccc9486c50" },
    { label: "Глава администрации Боринского сельсовета", value: "8cb7fc5f-fb8f-459a-b209-8856a8a8434e" },
    { label: "Глава администрации Сенцовского сельсовета", value: "8e16808a-66b6-4e36-b7f9-135e30a54208" },
    { label: "Глава администрации Падовского сельсовета", value: "92000d73-8bdf-44c3-aea1-5a8db19c424d" },
    { label: "Глава администрации Стебаевского сельсовета", value: "9b87c5bf-c480-4c49-afc6-9c50751c8c99" },
    { label: "Глава администрации Частодубравского сельсовета", value: "b51210ac-9f58-4b06-9046-42fb90baa542" },
    { label: "Глава администрации Новодмитриевского сельсовета", value: "c28d9725-db40-4723-842f-deef55846aef" },
    { label: "Глава администрации Лубновского сельсовета", value: "cd32fbcf-de73-45d9-9ee2-c61e736a53fe" },
    { label: "Глава администрации Новодеревенского сельсовета", value: "d64b344f-ed8c-48ad-a2a1-f46c19a9b894" },
    { label: "Глава администрации Ивовского сельсовета", value: "f6be88df-3273-4b0f-8102-6db80944fddd" },
    { label: "Глава администрации Пружинского сельсовета", value: "f85f50d5-ea66-44b0-8cd0-d7123320950a" },
    { label: "Глава администрации Кузьмино-Отвержского сельсовета", value: "f93a4978-af5a-43b3-a9ef-036a24856561" }
  ];

const sourceOptions = [
    { label: "Ленинский территориальный отдел", value: "1d22d53a-df2d-492c-a6e6-19725134356b" },
    { label: "Частодубравский территориальный отдел", value: "21ff741b-2494-4bf6-a1f9-250e94d1c64d" },
    { label: "Стебаевский территориальный отдел", value: "2348244c-65bb-49a9-801a-3f961b6caea8" },
    { label: "Грязновский территориальный отдел", value: "2ac996e6-1203-4efb-8ea9-8823a52d27a0" },
    { label: "Новодеревенский территориальный отдел", value: "2b7faf3c-fb8c-441a-a067-7c27c1ef8b21" },
    { label: "Косыревский территориальный отдел", value: "358b3f7a-f6bb-477a-a475-efc2748b2644" },
    { label: "Сырский территориальный отдел", value: "433108c7-b4e6-4b2c-aab4-d21f87dfec68" },
    { label: "Тележенский территориальный отдел", value: "45b1e377-d4d6-496c-81bd-f835e88214a8" },
    { label: "Крутохуторской территориальный отдел", value: "6f749cd3-e631-4db7-a58b-7eb4944ca0c1" },
    { label: "Кузьмино-Отвержский территориальный отдел", value: "7dcef2ec-fc60-4e1f-a852-a30463eab315" },
    { label: "Пружинский территориальный отдел", value: "831ae92a-ac52-4412-a421-d3da37be810e" },
    { label: "Новодмитриевский территориальный отдел", value: "83db97ee-6022-47df-9355-a6001ce0d3b5" },
    { label: "Большекузьминский территориальный отдел", value: "8aa4692d-0eae-437b-911d-c053a0c1ff33" },
    { label: "Васильевский территориальный отдел", value: "8dda4549-db3f-418f-a365-25c9c818fc5f" },
    { label: "Вербиловский территориальный отдел", value: "9021a843-7db2-4bc4-8fdf-18011d0f170d" },
    { label: "Падовский территориальный отдел", value: "96b87f73-fde2-4662-bb47-35bdd2198cc9" },
    { label: "Сенцовский территориальный отдел", value: "a7f66343-be4f-4acb-9fed-c876808e9812" },
    { label: "Телефонный звонок", value: "ad52ac00-da1c-4f1c-ab30-13c8cfb90f3b" },
    { label: "Введенский территориальный отдел", value: "ae6b68d1-d372-49aa-a10d-6dc733332f21" },
    { label: "Боринский территориальный отдел", value: "aed6c10b-17c4-4ffa-aa85-9a2446966af2" },
    { label: "Лубновский территориальный отдел", value: "b9975f38-fc0e-4a80-94fc-e56424a59cbc" },
    { label: "ФГБУЗ «Центр гигиены и эпидемиологии в Липецкой области»", value: "c62e4be7-059d-4e25-b35e-d15d75b55a31" },
    { label: "Сайт «Развиваем Липецкую область вместе»", value: "c9e384e7-2563-4897-972b-8ed758b0fabb" },
    { label: "Административная комиссия", value: "cd9b500d-6c5c-4c83-b678-e8e7a2423772" },
    { label: "Ивовский территориальный отдел", value: "e5fbb7f0-fb85-46f4-bbb5-ab8df728d4ba" }
];


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
      id: ""
    },
    behavior: "",
    contact_person: "",
    dogs_count: 0,
    urgency: "",
    source: {
      id: ""
    }
  });

  // Обработчик для текстовых полей
  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Обработчик для селектов
  const handleSelectChange = (field: string) => (selectedValue: string) => {
    if (field === "applicant") {
      setFormData(prev => ({
        ...prev,
        applicant: {
          id: selectedValue
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: selectedValue
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
        address: formData.address,
        applicant: {
          id: formData.applicant.id
        },
        behavior: formData.behavior,
        contact_person: formData.contact_person,
        dogs_count: Number(formData.dogs_count),
        urgency: formData.urgency,
        ...(formData.source && { applicant_info: formData.source })
      };

      console.log("Отправка данных на /requests:", submissionData);

      // Отправка на API через ваш axios instance
      const response = await api.post('/requests', submissionData);

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
        
        if (typeof serverError === 'object') {
          // Если ошибка в формате { field: ["error message"] }
          const errorMessages = Object.values(serverError).flat();
          setSubmitError(errorMessages.join(', ') || "Ошибка при отправке заявки");
        } else if (typeof serverError === 'string') {
          setSubmitError(serverError);
        } else {
          setSubmitError("Ошибка при отправке заявки. Попробуйте позже.");
        }
      } else {
        setSubmitError(error.message || "Произошла ошибка при отправке заявки. Попробуйте позже.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      address: "",
      applicant: {
        id: ""
      },
      behavior: "",
      contact_person: "",
      dogs_count: 0,
      urgency: "",
      source: {
        id: ""
      }
    });
  };

  return (

    <div className="h-screen -mt-22 sm:mt-0 flex justify-center w-full items-center px-4">
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
              icon={<MapPin className="h-5 w-5"/>}
              label="Адрес"
              id="address"
              type="text"
              placeholder="Введите адрес"
              required
              value={formData.address || ""}
              onChange={(e) => handleInputChange("address", e.target.value)}
            />

            <InputWithLabel
              icon={<RectangleEllipsis className="h-5 w-5"/>}
              label="Количество"
              id="count"
              type="number"
              placeholder="Введите количество"
              required
              value={formData.dogs_count || ""}
              onChange={(e) => handleInputChange("dogs_count", parseInt(e.target.value) || 0)}
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

            <Label><Smile className="h-5 w-5"/> Поведение</Label>
              <Select
              placeholder="Выберите поведение"
                items={[
                  { label: "Агрессивное", value: "agressor" },
                  { label: "Не агрессивное", value: "non agressor" },
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

            <Label><Clock className="h-5 w-5"/> Срочность</Label>
              <Select
              placeholder="Выберите срочность"
                items={[
                  { label: "Срочно", value: "agressor" },
                  { label: "Не срочно", value: "non fast" },
                ]}
                value={formData.urgency || ""}
                onValueChange={handleSelectChange("urgency")}
                />
          </div> 


          {/* Правая колонка */}
          <div className="flex-1 flex flex-col gap-4">
            <h3 className="font-semibold text-sm mb-2">Информация о заявителе</h3>

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

            <Label><UserRound className="h-5 w-5"/> Заявитель</Label>
              <Select
              placeholder="Выберите заявителя"
                items={applicantOptions}
                value={formData.applicant.id || ""}
                onValueChange={handleSelectChange("applicant")}
                />

            <Label><FileUser className="h-5 w-5"/> Сведения о заявителе</Label>
              <Select
              placeholder="Выберите сведения о заявителе"
                items={sourceOptions}
                value={formData.source.id || ""}
                onValueChange={handleSelectChange("source")}
                />

            <InputWithLabel
              icon={<Contact className="h-5 w-5"/>}
              label="Контактное лицо"
              id="contact"
              type="text"
              placeholder="Введите контактное лицо"
              required
              value={formData.contact_person || ""}
              onChange={(e) => handleInputChange("contact_person", e.target.value)}
            />
          </div>

        </div>

        {/* Кнопки */}
        <div className="flex items-center mt-6 w-full gap-6">
          <Button variant={"cube"} size={"default"} color={"grey"} className="flex-1" onClick={handleClear}>Очистить форму</Button>
          <Button variant={"cube"} size={"default"} color="default" className="flex-1" onClick={handleSubmit}>Подать заявку</Button>
        </div>
      </div>
    </div>
  );
};
