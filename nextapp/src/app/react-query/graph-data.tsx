"use client";
import { SensorData, SensorDataResponse } from "../types";
import { useQuery } from "react-query";
import React from "react";
import { utcToZonedTime, format } from "date-fns-tz";
import { parseISO, format as _format } from "date-fns";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

async function getData({ query_date }: { query_date: string }) {
  const res = await fetch(
    "http://localhost:8000/data?query_date=" + query_date
  );
  return (await res.json()) as SensorDataResponse;
}

export default function GraphData() {
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
  if (isLoading) return <div>loading...</div>;
  if (isError) return <div>error...</div>;
  if (!data) return <div>no data</div>;
  const array = data?.data;
  if (!array || array.length === 0) {
    return <div>no data</div>;
  }

  const round_max = (f: number) => Math.ceil(f * 100) / 100;
  const round_min = (f: number) => Math.floor(f * 100) / 100;

  const temp_min = Math.min(...array.map((d) => d.temperature));
  const temp_max = Math.max(...array.map((d) => d.temperature));
  const variant = (temp_max - temp_min) * 0.15;

  const temp_domain_min = round_min(temp_min - variant);
  const temp_domain_max = round_max(temp_max + variant);

  return (
    <LineChart width={800} height={600} data={array}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="ca" />
      <YAxis
        yAxisId="left"
        orientation="left"
        domain={[temp_domain_min, temp_domain_max]}
        stroke="#8884d8"
      />
      <YAxis
        yAxisId="right"
        orientation="right"
        domain={[30, 100]}
        stroke="#82ca9d"
      />
      <Tooltip />
      <Legend />
      <Line
        yAxisId="left"
        type="monotone"
        dataKey="temperature"
        stroke="#8884d8"
        activeDot={{ r: 1 }}
      />
      <Line
        yAxisId="right"
        type="monotone"
        dataKey="humidity"
        stroke="#82ca9d"
      />
    </LineChart>
  );
}
