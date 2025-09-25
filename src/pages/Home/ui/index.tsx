import { Link } from "react-router-dom";
import { Button } from "@shared/ui/button";

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
      </div>
    </section>
  );
};
