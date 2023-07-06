import { SensorDataFetch, SensorDataResponse } from "@/types/sensor";
import { format, formatISO } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { useEffect, useState } from "react";

export function useApi() {
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
