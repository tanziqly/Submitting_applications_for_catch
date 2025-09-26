import { Link } from "react-router-dom";
import { Button } from "@shared/ui/button";
import { RefreshCcwDot } from "lucide-react";
import { File } from "lucide-react";
import { CircleCheck } from "lucide-react";

export const Home = () => {
  return (
    <section className="w-full flex bg-gradient-to-b from-[#FFFFFF] to-[rgba(202,221,255,0.51)] flex-col items-center justify-center min-h-screen text-center px-4">
      <div className="max-w-[1440px]">
        {/* Заголовок */}
        <h1 className="text-[35px] font-bold leading-tight text-[#6582A0] md:text-[65px]">
          Центр приема заявок <br />
          на отлов{" "}
          <span className="text-[#0239C9] underline">
            безнадзорных животных.
          </span>
        </h1>

        {/* Подзаголовок */}
        <p className="mt-6 text-[14px] text-[#5B5B5B] md:text-[24px]">
          Подача заявлений на отлов бездомных собак <br />
          Официальный портал города Липецк
        </p>

        {/* Кнопка */}
        <div className="mt-8">
          <Link to="/application">
            <Button variant="default" size="default" color="default">
              Подать заявку →
            </Button>
          </Link>
        </div>
        <div className="flex items-center flex-col mt-20">
          <span className="font-bold sm:text-xl text-[#65819F]">
            Как это работает:
          </span>
          <div className="flex gap-6 mt-4 flex-col md:flex-row">
            <div className="flex gap-1 text-left items-center leading-[24px] px-12 py-4 w-[370px] flex justify-center sm:w-[250px] rounded-[8px] bg-white text-sm font-medium">
              <RefreshCcwDot className="size-[48px] text-[#0239C9]" /> Заполните
              <br />
              заявку
            </div>
            <div className="flex gap-1 text-left items-center leading-[24px] px-12 py-4 w-[370px] flex justify-center sm:w-[250px] rounded-[8px] bg-white text-sm font-medium">
              <File className="size-[48px] text-[#0239C9]" /> Обработка
              <br />
              заявки
            </div>
            <div className="flex gap-1 text-left items-center leading-[24px] px-12 py-4 w-[370px] flex justify-center sm:w-[250px] rounded-[8px] bg-white text-sm font-medium">
              <CircleCheck className="size-[48px] text-[#0239C9]" /> Принимаются
              <br />
              меры
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
