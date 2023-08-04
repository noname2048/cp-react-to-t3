/* 여러개의 sensor와 마지막 sensor의 데이터를 보여주는 페이지
 */
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { format, formatDistance, parseISO, toDate } from "date-fns";
import { ko } from "date-fns/locale";
import { baseUrl, baseWsUrl } from "@/config";
import { formatInTimeZone, utcToZonedTime } from "date-fns-tz";

const utc2kst = (v: string): string => {
  const utcDate = parseISO(v);
  const kstDate = utcToZonedTime(utcDate, "Asia/Seoul");
  return format(kstDate, "HH:mm:ss");
};

const getDuration = (now: Date, v: string): string => {
  const t = parseISO(v);
  return formatDistance(now, t, {
    locale: ko,
  });
};

const iso2kst = (v: string): string => {
  const utcDate = parseISO(v);
  const kstDate = utcToZonedTime(utcDate, "Asia/Seoul");
  return format(kstDate, "yyyy-MM-dd HH:mm:ss zzz");
};

const asiaSeoul = "Asia/Seoul";

type SensorWithLast = {
  uuid: string;
  name?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  temperature?: number;
  humidity?: number;
  last?: string;
};

type RealtimeData = {
  id: number;
  uuid: string;
  temperature: number;
  humidity: number;
  created_at: string;
};

export default function SensorsPage() {
  const [sensors, setSensors] = useState<SensorWithLast[]>([]);
  const fetchSensors = async () => {
    const res = await fetch(`${baseUrl}/api/sensors/last`, {
      method: "GET",
    });
    const resData = await res.json();
    setSensors(resData);
  };

  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const fetchWs = async () => {
    const websocket = new WebSocket(`${baseWsUrl}/ws/broadcast`);
    websocket.onopen = () => {
      console.log("websocket connected");
      ws.current = websocket;
      setIsConnected(true);
    };
    websocket.onclose = () => {
      console.log("websocket disconnected");
      ws.current = null;
      setIsConnected(false);
    };
    websocket.onmessage = (event) => {
      const resData: RealtimeData = JSON.parse(event.data);
      console.log("message", resData);
      setSensors((prev) => {
        return prev.map((sensor: SensorWithLast) => {
          if (sensor.uuid === resData.uuid) {
            console.log("update sensor", sensor.uuid, resData.temperature);
            return {
              ...sensor,
              temperature: resData.temperature,
              humidity: resData.humidity,
              last: resData.created_at,
            };
          } else return sensor;
        });
      });
    };
  };

  const [now, setNow] = useState<Date>(new Date(0));

  const isInitialized = useRef(false);
  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      // fetch once
      fetchSensors().then();
    }

    if (!isConnected && ws.current === null) {
      fetchWs().then();
    }

    setNow(new Date());
  }, [isConnected]);

  return (
    <div>
      <div className="flex flex-row items-center">
        <button
          className="ml-4 my-2 mx-2 py-2 px-4 border rounded border-blue-700 hover:bg-blue-700
        text-blue-700 hover:text-white"
          onClick={fetchSensors}
        >
          fetch
        </button>
        <button
          className="my-2 mx-2 py-2 px-4 border rounded border-blue-700 hover:bg-blue-700
                text-blue-700 hover:text-white"
          onClick={() => {
            console.log("ws status", ws.current?.url);
          }}
        >
          disconnect
        </button>
      </div>
      <div className="my-2 mx-4 border-top">
        {ws.current?.readyState === WebSocket.OPEN && <p>{ws.current.url}</p>}
        <p>{now.toISOString()}</p>
        <p>{utcToZonedTime(now, asiaSeoul).toISOString()}</p>
      </div>
      <div className="flex flex-row flex-wrap gap-2 my-2 mx-4">
        {sensors.map((sensor: SensorWithLast) => (
          <Link key={sensor.uuid} href={`/sensors/${sensor.uuid}`}>
            <ul className="py-2 px-4 border border-gray-500 rounded w-96">
              <li className="text-gray-600">{sensor.uuid}</li>
              <li className="text-gray-800 font-semibold">
                {sensor.name ?? "default"}
              </li>
              <li className="text-gray-300">{iso2kst(sensor.created_at)}</li>
              <div className="mt-8 mx-12 mb-8 border rounded border-gray-800 py-2 px-4">
                {sensor?.last ? (
                  <>
                    <p>{sensor.temperature?.toFixed(1)} °C</p>
                    <p>{sensor.humidity?.toFixed(1)} %</p>
                    <p>
                      마지막 수신: &nbsp;
                      {getDuration(now, sensor.last)} ({utc2kst(sensor.last)})
                    </p>
                    <p className="text-sm text-gray-400">
                      {formatInTimeZone(
                        parseISO(sensor.last),
                        asiaSeoul,
                        "yyyy-MM-dd HH:mm:ss zzz"
                      )}
                    </p>
                  </>
                ) : (
                  <p className="text-gray-500">온도데이터가 없습니다.</p>
                )}
              </div>
            </ul>
          </Link>
        ))}
      </div>
    </div>
  );
}
