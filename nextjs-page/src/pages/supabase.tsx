import GraphTemperature from "@/components/graph-data";
import TextTemperature from "@/components/list-data";
import {SensorDataFetch, SensorDataResponse} from "@/types/sensor";
import {format, formatISO} from "date-fns";
import {utcToZonedTime} from "date-fns-tz";
import Head from "next/head";
import {useEffect, useState} from "react";

export default function Supabase() {
  const { data, isLoading, isError } = useFetch();
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;
  if (!data?.data) return <div>No Data</div>;
  const array = data.data;

  return (
    <>
      <Head>
        <title>Temperature of home</title>
      </Head>
      <main className="flex flex-col min-h-screen max-h-screen items-center justify-center p-24 bg-slate-300">
        <div className="rounded-md border-2 border-black m-4 w-[800px] h-[600px]">
          <GraphTemperature array={array} />
        </div>
        <div className="flex w-[800px] h-[300px]">
          <TextTemperature array={array} />
        </div>
      </main>
    </>
  );
}

export function useFetch() {
  const [data, setData] = useState<SensorDataFetch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/data");
        const json: SensorDataResponse = await response.json();
        const array = json["data"];
        const new_array = array
          .map((d) => ({
            ...d,
            created_at: formatISO(utcToZonedTime(d.created_at, "Asia/Seoul")),
            ca: format(utcToZonedTime(d.created_at, "Asia/Seoul"), "HH:mm"),
          }))
          .sort((a, b) => a.created_at.localeCompare(b.created_at));
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
}
