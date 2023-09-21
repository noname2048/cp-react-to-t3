import {useState} from "react";

export default function SubMain() {
  const [sensors, setSensors] = useState([]);

  return (
    <div>
      <button
        className="
      py-2 px-4
      my-2 mx-4
      text-blue-700 font-semibold border border-blue-500 rounded
      hover:text-white hover:bg-blue-500
      "
        onClick={async () => {
          const res = await fetch("http://localhost:8000/api/sensors", {
            method: "GET",
          });
          const resData = await res.json();
          setSensors(resData);
        }}
      >
        Fetch Sensors
      </button>
      <button
        className="
      py-2 px-4
      my-2 mx-4
      text-green-700 font-semibold border border-green-500 rounded
      hover:text-white hover:bg-green-500
      "
      >
        Fetch One Data
      </button>
    </div>
  );
}
