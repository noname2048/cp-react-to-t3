import { format } from "date-fns";
// import { useState, useEffect } from "react";

export default function DisplayBox({
  temp = 25.0,
  hum = 60.0,
}: {
  temp?: number;
  hum?: number;
}) {
  return (
    <div className="h-full w-full flex justify-center items-center p-20">
      <div className="flex-grow aspect-square flex flex-col justify-center items-center  bg-sky-300 rounded-2xl">
        <div className="flex-grow flex justify-center items-center text-white text-2xl font-extrabold">
          {format(new Date(), "MM/dd HH:mm:ss")}
        </div>
        <div className="flex-grow flex justify-center items-center text-white text-6xl font-extrabold">
          {temp.toFixed(1)}C
        </div>
        <div className="flex-grow flex justify-center items-center text-slate-300 text-6xl font-extrabold">
          {hum.toFixed(1)}%
        </div>
      </div>
    </div>
  );
}
