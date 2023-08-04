import { SensorDataDisplay } from "@/types/sensor";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getTemperatureDomain } from "@/utils/get-temperature-domain";
import { parseISO, format } from "date-fns";

const iso2kst = (iso: string) => {
  const utcDate = parseISO(iso);
  return format(utcDate, "yyyy-MM-dd HH:mm:ss zzz");
};

const iso2short = (iso: string) => {
  const utcDate = parseISO(iso);
  return format(utcDate, "HH:mm");
};

export default function GraphTemperature({
  array,
}: {
  array: SensorDataDisplay[];
}) {
  if (!array)
    return (
      <div className="flex flex-col items-center w-[800px] h-[600px]">
        No Data
      </div>
    );
  const { temp_domain_min, temp_domain_max } = getTemperatureDomain(array);
  const proceesedArray = array
    .map((item, index) => {
      return {
        ...item,
        humunize: iso2kst(item.created_at),
        short: iso2short(item.created_at),
      };
    })
    .sort((a, b) => {
      return a.created_at > b.created_at ? 1 : -1;
    });

  return (
    <div className="flex flex-col items-center">
      <LineChart width={800} height={600} data={proceesedArray}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="humunize" />
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
}
