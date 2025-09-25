import { Button } from "@shared/ui/button";
import { InputWithLabel } from "@shared/ui/inputLabel";
import { ClipboardPlus, MapPin, RectangleEllipsis, UserRound, FileUser, Contact, Smile, Clock } from 'lucide-react';
import { Select } from "@shared/ui/dropdown";
import { Label } from "@shared/ui/label";

export const Application = () => {
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
            />

            <InputWithLabel
              icon={<RectangleEllipsis className="h-5 w-5"/>}
              label="Количество"
              id="count"
              type="number"
              placeholder="Введите количество"
              required
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
                ]}/>

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
                ]}/>
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
                items={[
                ]}/>

            <Label><FileUser className="h-5 w-5"/> Сведения о заявителе</Label>
              <Select
              placeholder="Выберите сведения о заявителе"
                items={[
                ]}/>

            <InputWithLabel
              icon={<Contact className="h-5 w-5"/>}
              label="Контактное лицо"
              id="contact"
              type="text"
              placeholder="Введите контактное лицо"
              required
            />
          </div>

        </div>

        {/* Кнопки */}
        <div className="flex items-center mt-6 w-full gap-6">
          <Button variant={"cube"} size={"default"} color={"grey"} className="flex-1">Очистить форму</Button>
          <Button variant={"cube"} size={"default"} color="default" className="flex-1">Подать заявку</Button>
        </div>
      </div>
    </div>
  );
};
