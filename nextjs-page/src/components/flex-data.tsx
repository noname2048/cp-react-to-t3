import { SensorDataDisplay } from "@/types/sensor";
import styled from "styled-components";

export default function FlexData({ array }: { array: SensorDataDisplay[] }) {
  return (
    <div className="w-full overflow-y-scroll" style={{ height: "33vh" }}>
      {array.map((d, idx) => (
        <div key={d.id} className="flex gap-0 items-center justify-center">
          <div className="flex justify-center w-[50px]">{idx}</div>
          <Divider />
          <div className="flex justify-center  w-[80px]">{d.id}</div>
          <Divider />
          <div className="flex justify-center  w-[40px]">
            {d.temperature.toFixed(1)}
          </div>
          <Divider />
          <div className="flex justify-center w-[40px]">
            {d.humidity.toFixed(1)}
          </div>
          <Divider />
          <div className="flex justify-center my-1 w-[280px]">
            {d.created_at}
          </div>
        </div>
      ))}
    </div>
  );
}

const Divider = styled.div`
  height: 10px;
  margin: 0 4px;
  border-left: 1px solid red;
  content: "";
`;
