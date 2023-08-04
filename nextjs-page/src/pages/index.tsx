import SensorCard from "@/components/sensor-card";
import { baseUrl, baseWsUrl } from "@/config";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type SensorWithLast = {
  uuid: string;
  name?: string;
  alias?: string;
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

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch(`${baseUrl}/api/sensors/last`);
  const sensors: SensorWithLast[] = await res.json();
  return { props: { sensors } };
};

type Props = {
  sensors: SensorWithLast[];
};

export default function App(
  props: Props
): InferGetServerSidePropsType<typeof getServerSideProps> {
  const [sensors, setSensors] = useState<SensorWithLast[]>(props.sensors);
  const websocket = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    if (websocket.current === null) {
      fetchWebsocket().then();
    }
  }, [isConnected]);

  /* websocket 을 연결합니다.
   */
  const fetchWebsocket = async () => {
    const ws = new WebSocket(`${baseWsUrl}/ws/broadcast`);
    ws.onopen = () => {
      console.log("websocket connected");
      websocket.current = ws;
      setIsConnected(true);
    };
    ws.onclose = () => {
      console.log("websocket disconnected");
      websocket.current = null;
      setIsConnected(false);
    };
    ws.onmessage = (event) => {
      const resData: RealtimeData = JSON.parse(event.data);
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

  return (
    <>
      <div className="m-4 flex flex-row flex-wrap gap-8">
        {sensors.map((sensor) => {
          if (sensor.last)
            return (
              <Link key={sensor.uuid} href={`/sensors/${sensor.uuid}`}>
                <SensorCard sensor={sensor} />
              </Link>
            );
          else return <SensorCard key={sensor.uuid} sensor={sensor} />;
        })}
      </div>
    </>
  );
}
