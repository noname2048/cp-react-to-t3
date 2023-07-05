"use client";

import { SensorData, SensorDataResponse } from "../types";
import { useQuery } from "react-query";
import React from "react";
import { utcToZonedTime, format } from "date-fns-tz";
import { parseISO, format as _format } from "date-fns";

async function getData({ query_date }: { query_date: string }) {
  const res = await fetch(
    "http://localhost:8000/data?query_date=" + query_date
  );
  return (await res.json()) as SensorDataResponse;
}

export default function ListData() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["hydrate-data"],
    queryFn: () =>
      getData({
        query_date: format(
          utcToZonedTime(new Date(), "Asia/Seoul"),
          "yyyy-MM-dd"
        ),
      }),
  });

  const array = data?.data;
  return (
    <div className="flex flex-col">
      {array &&
        array.map((d: SensorData) => (
          <div key={d.id} className="flex">
            <div className="w-40 flex justify-center items-center">
              {d.temperature}
            </div>
            <div className="w-40 flex justify-center items-center">
              {d.humidity}
            </div>
            <div className="w-40 flex justify-center items-center">
              {_format(parseISO(d.created_at), "HH:mm")}
            </div>
          </div>
        ))}
    </div>
  );
}
