import {
  differenceInSeconds,
  format,
  formatDistance,
  parseISO,
} from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { ko } from "date-fns/locale";
import { useEffect, useState } from "react";

type SensorWithLast = {
  uuid: string;
  name?: string | undefined;
  alias?: string | undefined;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  temperature?: number;
  humidity?: number;
  last?: string;
};

type Props = {
  sensor: SensorWithLast;
};

const tz = "Asia/Seoul";

const iso2kstIso = (iso: string) => {
  const utcDate = parseISO(iso);
  const kstDate = utcToZonedTime(utcDate, tz);
  return format(kstDate, "yyyy-MM-dd HH:mm:ss zzz");
};

const iso2kstDuration = (now: Date, iso: string) => {
  const utcDate = parseISO(iso);
  return formatDistance(now, utcDate, { locale: ko, includeSeconds: true });
};

const isWithinTenSeconds = (now: Date, iso: string) => {
  const utcDate = parseISO(iso);
  return differenceInSeconds(now, utcDate) <= 10;
};

export default function SensorCard(props: Props) {
  const { sensor } = props;
  const { name, alias, temperature, humidity, last, is_active } = sensor;
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 2500);
    return () => clearInterval(interval);
  });

  return (
    <div
      className={`
    w-[21rem] rounded-lg bg-white p-4 text-[0.8125rem] leading-5
    shadow-xl shadow-black/5 hover:bg-slate-50 ring-2 ${
      is_active ? "ring-indigo-600" : "ring-gray-300"
    }
    group`}
    >
      <div className="flex justify-between">
        <div className="flex flex-row w-[10rem] gap-2">
          <div className="font-medium text-slate-900">{name}</div>
          <div className="text-slate-700">({alias})</div>
        </div>
        <svg
          className={`h-5 w-5 flex-none ${
            last && "group-hover:visible"
          } invisible`}
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.707-9.293a1 1 0 0 0-1.414-1.414L9 10.586 7.707 9.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4Z"
            fill="#4F46E5"
          ></path>
        </svg>
      </div>
      <div className="flex justify-between mt-1 text-slate-700">
        {last ? (
          <>
            <div
              className={`${
                isWithinTenSeconds(now, last) ? "text-green-700" : ""
              }`}
            >
              {last ? iso2kstDuration(now, last) : ""}
            </div>
            <div
              className={`${
                isWithinTenSeconds(now, last) ? "text-green-700" : ""
              }`}
            >
              {iso2kstIso(last)}
            </div>
          </>
        ) : (
          <div>데이터 없음</div>
        )}
      </div>
      <div className="flex justify-between mt-6 font-medium text-slate-900">
        {!last && <div>N/A</div>}
        {last && (
          <>
            <div className="flex justify-between gap-1">
              <div>온도</div> <div>{temperature?.toFixed(1)}</div>
            </div>
            <div className="flex justify-between gap-1">
              <div>습도</div> <div>{humidity?.toFixed(1)}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
