import { baseUrl } from "@/config";
import { SensorDataDisplay } from "@/types/sensor";
import { parseISO } from "date-fns";
import { useRouter } from "next/router";
import type { Sensor } from "@/schemas";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useEffect, useRef, useState } from "react";
import GraphTemperature from "@/components/graph-data";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const uuid = context.params?.uuid;
  if (uuid === undefined) return { props: {} };
  const url = `${baseUrl}/api/sensors/uuid/${uuid}`;
  try {
    const res = await fetch(url, {});
    const sensor: Sensor = await res.json();
    return { props: { sensor, notFound: res.status !== 200 } };
  } catch (err) {
    console.log(err);
    return { props: {} };
  }
};

const getLast = (records: SensorDataDisplay[]) => {
  if (records.length === 0) return null;
  return records[records.length - 1];
};

const iso2kst = (iso: string) => {
  const date = parseISO(iso);
  return date.toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
  });
};

export default function SensorRetrievePage({
  sensor,
  notFound,
}: {
  sensor?: Sensor;
  notFound?: boolean;
}): InferGetServerSidePropsType<typeof getServerSideProps> {
  const router = useRouter();
  const uuid = router.query.uuid;

  const [records, setRecords] = useState<SensorDataDisplay[]>([]);
  const fetchRecords = async () => {
    const res = await fetch(`${baseUrl}/api/sensor_records?uuid=${uuid}`);
    const resData = await res.json();
    setRecords(resData);
  };
  const isInitialized = useRef<boolean>(false);
  const lastRecord: SensorDataDisplay | null = getLast(records);

  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      fetchRecords().then();
    }
  });

  if (notFound) return <div>sensor not found</div>;
  return (
    <div className="flex flex-col items-center">
      <div className="w-[700px]">
        <h3 className="font-bold text-3xl">{sensor?.name}</h3>
        <p className="text-gray-400">{uuid}</p>
        <p className="text-4xl font-bold mt-3">{sensor?.alias}</p>
        <p className="text-gray-400">
          {iso2kst(lastRecord?.created_at as string)}
        </p>
        <div className="flex flex-row justify-start gap-3">
          <p className="pt-4 p-3">온도: {lastRecord?.temperature}</p>
          <p className="pt-4 p-3">습도: {lastRecord?.humidity}</p>
        </div>
      </div>
      <GraphTemperature
        array={records.filter((record, index) => index % 20 === 0)}
      />
    </div>
  );
}
