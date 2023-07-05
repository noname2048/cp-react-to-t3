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
}
