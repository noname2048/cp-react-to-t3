import { format } from "date-fns";
import { parseISO } from "date-fns";
import type { SensorDataDisplay } from "@/types/sensor";
import { utcToZonedTime } from "date-fns-tz";
import { useState, useEffect } from "react";

export default function DisplayBox({
  array = [],
}: {
  array?: SensorDataDisplay[];
}) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const now = format(utcToZonedTime(time, "Asia/Seoul"), "MM-dd HH:mm:ss");
  const last = array.at(-1);
  let temperature = "no data";
  let humidity = "no data";
  let created_at = "no data";
  if (last) {
    temperature = `${last.temperature.toFixed(1)}C`;
    humidity = `${last.humidity.toFixed(1)}%`;
    created_at = format(parseISO(last.created_at), "MM/dd HH:mm:ss");
  }

  return (
    <div className="h-full w-full flex justify-center items-center">
      <div className="w-[250px] h-[250px] aspect-square flex flex-col justify-center items-center bg-sky-300 rounded-2xl">
        <div className="flex-grow flex gap-3 justify-center items-center text-gray-500 text-2xl font-bold">
          <div>{now.split(" ")[0]}</div>
          <div>{now.split(" ")[1]}</div>
        </div>
        <div className="flex-grow flex gap-3 justify-center items-center text-white text-2xl font-extrabold">
          <div>{created_at.split(" ")[0]}</div>
          <div>{created_at.split(" ")[1]}</div>
        </div>
        <div className="flex-grow flex justify-center items-center text-white text-4xl font-extrabold">
          {temperature}
        </div>
        <div className="flex-grow flex justify-center items-center text-slate-300 text-4xl font-extrabold">
          {humidity}
        </div>
      </div>
    </div>
  );
}
