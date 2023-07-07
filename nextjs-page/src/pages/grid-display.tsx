import DisplayBox from "@/components/display-box";
import TextTemperature from "@/components/list-data";
import GraphTemperature from "@/components/graph-data";
import { useApi } from "@/utils/use-api";

export default function GridDisplay() {
  const { data, isLoading, isError } = useApi();
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error...</div>;
  const array = data?.data;
  if (!array) return <div>No Data</div>;

  return (
    <div
      className="min-h-screen min-w-fit grid gird-cols-3"
      style={{ gridAutoColumns: "1fr" }}
    >
      <div className="bg-red-50 row-span-2 col-span-3 flex justify-center items-center">
        <GraphTemperature array={array} />
      </div>
      <div className="bg-blue-50 row-span-1 col-span-2 flex justify-center items-center">
        <TextTemperature array={array} />
      </div>
      <div className="bg-green-50 row-span-1 col-span-1 flex justify-center items-center">
        <DisplayBox array={array} />
      </div>
    </div>
  );
}
