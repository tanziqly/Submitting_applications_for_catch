import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@shared/ui/dropdown-menu";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@shared/ui/select";
import { ArrowDownWideNarrow } from "lucide-react";

type FilterKind = "none" | "terotdel" | "year";

export default function FilterDropdownInline() {
  const [active, setActive] = useState<FilterKind>("none");
  const [terValue, setTerValue] = useState<string>("");
  const [yearFrom, setYearFrom] = useState<string>("");
  const [yearTo, setYearTo] = useState<string>("");

  function toggle(kind: FilterKind) {
    setActive((prev) => (prev === kind ? "none" : kind));
  }

  return (
    <div className="inline-block">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2">
            <span>Фильтр</span>
            <ArrowDownWideNarrow size={18} />
          </Button>
        </DropdownMenuTrigger>

        {/* 
          align="end" — выравнивает правую границу контента по правой границе кнопки
          sideOffset={4} — отступ вниз
        */}
        <DropdownMenuContent
          align="end"
          side="bottom"
          sideOffset={4}
          className="w-80 p-0 overflow-hidden shadow-lg border border-gray-200 rounded-xl"
        >
          {/* Кнопки фильтров */}
          <div className="p-3 border-b bg-white">
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => toggle("terotdel")}
                className={`w-full text-left px-3 py-2 rounded-md ${
                  active === "terotdel"
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "hover:bg-slate-50"
                }`}
              >
                Только теротдел
              </button>

              <button
                type="button"
                onClick={() => toggle("year")}
                className={`w-full text-left px-3 py-2 rounded-md ${
                  active === "year"
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "hover:bg-slate-50"
                }`}
              >
                По году
              </button>
            </div>
          </div>

          {/* Раскрывающаяся форма */}
          <div
            className={`bg-white transition-[max-height,opacity,transform] duration-200 ease-in-out overflow-hidden ${
              active === "none"
                ? "max-h-0 opacity-0 -translate-y-1"
                : "max-h-[320px] opacity-100 translate-y-0"
            }`}
          >
            {/* Теротдел */}
            <div
              className={`${active === "terotdel" ? "block" : "hidden"} p-4`}
            >
              <h4 className="text-lg font-semibold mb-2">Выбрать теротдел</h4>
              <Select value={terValue} onValueChange={(v) => setTerValue(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите теротдел" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="north">Северный</SelectItem>
                  <SelectItem value="center">Центральный</SelectItem>
                  <SelectItem value="south">Южный</SelectItem>
                </SelectContent>
              </Select>

              <div className="mt-4 text-center">
                <Button className=" text-white w-full">Применить</Button>
              </div>
            </div>

            {/* По году */}
            <div className={`${active === "year" ? "block" : "hidden"} p-4`}>
              <h4 className="text-lg font-semibold mb-2">По году</h4>

              <label className="text-sm text-gray-600">От</label>
              <Input
                type="number"
                placeholder="Введите год"
                value={yearFrom}
                onChange={(e) => setYearFrom(e.target.value)}
                className="mt-1"
              />

              <label className="text-sm text-gray-600 mt-3 block">До</label>
              <Input
                type="number"
                placeholder="Введите год"
                value={yearTo}
                onChange={(e) => setYearTo(e.target.value)}
                className="mt-1"
              />

              <div className="mt-4 text-center">
                <Button className="bg-blue-600 text-white w-full">
                  Применить
                </Button>
              </div>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
