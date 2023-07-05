"use client";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import Image from "next/image";
import Head from "next/head";
import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";

export default function Page() {
  return (
    <>
      <Head>
        <title>Temperature of home</title>
      </Head>
      <main className="flex flex-col min-h-screen max-h-screen items-center justify-center p-24 bg-slate-300">
        <div className="rounded-md border-2 border-black m-4">
          <GraphTemperature />
        </div>
        <div className="flex w-[800px]">
          <TextTemperature />
        </div>
      </main>
    </>
  );
}

interface Record {
  id: number;
  temperature: number;
  humidity: number;
  created_at: string;
  ca: string;
}

interface RecordResponse {
  data: Record[];
}

const useFetch = () => {
  const [data, setData] = useState<RecordResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:8000/data");
        const json = await response.json();
        const array = json["data"];
        const new_array = array.map((d: Record) => ({
          ...d,
          ca: format(parseISO(d.created_at), "HH:mm"),
        }));
        setData({ ...json, data: new_array });
      } catch (err) {
        setIsError(true);
        if (err instanceof Error) setError(err);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return { data, isLoading, isError, error };
};

const TextTemperature = () => {
  const { data, isLoading } = useFetch();
  if (isLoading) return <div>Loading...</div>;
  if (!isLoading && !data) return <div>Error</div>;
  const array = data?.data;
  return (
    <div className="w-[800px] h-[300px] flex flex-col gap-y-0 overflow-y-auto p-2 border-2 border-black rounded-md">
      {array &&
        array.map((tempHum) => (
          <div
            className="flex flex-row justify-center items-center border-black text-sm gap-y-0 gap-x-2"
            key={tempHum.id}
          >
            <div className="px-2 py-0.5 border border-slate-700 w-[60px] text-right">
              {" "}
              {tempHum.temperature.toFixed(1)}C{" "}
            </div>
            <div className="px-2 py-0.5 border border-slate-700 w-[60px] text-right">
              {tempHum.humidity.toFixed(1)}%
            </div>
            <div className="px-2 py-0.5 border border-slate-700 w-[80px] text-right">
              {tempHum.ca}
            </div>
          </div>
        ))}
    </div>
  );
};

const MessageTemplate = ({
  width = 800,
  height = 600,
  message = "",
}: {
  width?: number;
  height?: number;
  message: string;
}) => {
  return (
    <div
      className="flex flex-col items-center"
      style={{ width: width, height: height }}
    >
      {message}
    </div>
  );
};

const GraphTemperature = () => {
  const { data, isLoading, error } = useFetch();
  if (isLoading) return <MessageTemplate message="Loading..." />;
  if (error) {
    console.log(error);
    return <MessageTemplate message="Error..." />;
  }

  const array = data?.data.map((d) => ({
    ...d,
    ca: format(parseISO(d.created_at), "HH:mm"),
  }));
  if (!array || array?.length === 0)
    return <MessageTemplate message="No Data..." />;

  const round_max = (f: number) => Math.ceil(f * 100) / 100;
  const round_min = (f: number) => Math.floor(f * 100) / 100;

  const temp_min = Math.min(...array.map((d) => d.temperature));
  const temp_max = Math.max(...array.map((d) => d.temperature));
  const variant = (temp_max - temp_min) * 0.15;

  const temp_domain_min = round_min(temp_min - variant);
  const temp_domain_max = round_max(temp_max + variant);

  return (
    <div className="flex flex-col items-center">
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
    </div>
  );
};
