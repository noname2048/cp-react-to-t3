import { SensorDataResponse, SensorDataFetch } from "@/types/sensor";
import { useState, useEffect } from "react";
import { parseISO, format, formatISO } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

export function useFetch() {
  const [data, setData] = useState<SensorDataFetch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:8000/api/v1/data");
        const json: SensorDataResponse = await response.json();
        const array = json["data"];
        const new_array = array.map((d) => ({
          ...d,
          created_at: formatISO(utcToZonedTime(d.created_at, "Asia/Seoul")),
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
}
