/* 여러개의 sensor와 마지막 sensor의 데이터를 보여주는 페이지
 */
import React, { useState } from "react";
import { formatDistance, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import { baseUrl } from "@/config";

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

export default function SensorsPage() {
  const [sensors, setSensors] = useState([]);
  const fetchSensors = async () => {
    const res = await fetch(`${baseUrl}/api/sensors/last`, {
      method: "GET",
    });
    const resData = await res.json();
    setSensors(resData);
  };
  return (
    <div>
      <button
        className="my-2 mx-4 py-2 px-4 border rounded border-blue-700 hover:bg-blue-700
        text-blue-700 hover:text-white"
        onClick={fetchSensors}
      >
        fetch
      </button>
      <div className="my-2 mx-4">
        {sensors.map((sensor: SensorWithLast) => (
          <div key={sensor.uuid} className="flex flex-row mb-2">
            <ul className="py-2 px-4 border border-gray-500 rounded">
              <li className="text-gray-600">{sensor.uuid}</li>
              <li className="text-gray-800 font-semibold">
                {sensor.name ?? "default"}
              </li>
              <li className="text-gray-300">{sensor.created_at}</li>
              <li className="text-gray-300">{sensor.updated_at}</li>
              {sensor?.last ? (
                <div className="mt-8 border rounded border-gray-800 py-2 px-4">
                  <p>{sensor.temperature} °C</p>
                  <p>{sensor.humidity} %</p>
                  <p>
                    마지막 수신: &nbsp;
                    {formatDistance(new Date(), parseISO(sensor.last), {
                      locale: ko,
                    })}
                  </p>
                </div>
              ) : (
                <div>온도데이터가 없습니다.</div>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
