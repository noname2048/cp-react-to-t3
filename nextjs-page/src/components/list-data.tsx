"use client";

import { SensorDataDisplay } from "@/types/sensor";

export default function TextTemperature({
  array,
}: {
  array: SensorDataDisplay[];
}) {
  if (!array)
    return (
      <div className="w-[800px] h-[300px] flex flex-col gap-y-0 overflow-y-auto p-2 border-2 border-black rounded-md">
        No Data
      </div>
    );
  return (
    <div>
      <div className="w-[800px] h-[300px] flex flex-col gap-y-0 overflow-y-auto p-2 border-2 border-black rounded-md">
        {array &&
          array.map((tempHum) => (
            <div
              className="flex flex-row justify-center items-center border-black text-sm gap-y-0 gap-x-2"
              key={tempHum.id}
            >
              <div className="px-2 py-0.5 border border-slate-700 w-[60px] text-right">
                {tempHum.id}
              </div>
              <div className="px-2 py-0.5 border border-slate-700 w-[60px] text-right">
                {tempHum.temperature.toFixed(1)}C
              </div>
              <div className="px-2 py-0.5 border border-slate-700 w-[60px] text-right">
                {tempHum.humidity.toFixed(1)}%
              </div>
              <div className="px-2 py-0.5 border border-slate-700 w-[250px] text-right">
                {tempHum.created_at}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
