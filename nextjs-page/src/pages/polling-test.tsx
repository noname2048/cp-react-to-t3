// restrict 모드에서 각각의 console.log 는 어떻게 출력되는가?
// 온도의 실시간 업데이트를 cron polling 으로 해결하기 위한 심플버전 이해

import {format} from "date-fns";
import React, {useEffect, useState} from "react";

export default function PollingTest() {
  const [fixedDate, setFixedDate] = useState(new Date(2023, 1, 1, 0, 0, 0));
  const [date, setDate] = useState(new Date(2023, 1, 1, 0, 0, 0));
  console.log("render");
  useEffect(() => {
    console.log("effect");
    setFixedDate(new Date());
    const id = setInterval(() => {
      setDate(() => {
        const newDate = new Date();
        console.log(id, newDate);
        return newDate;
      });
    }, 1000);
    console.log(id, "set");
    return () => {
      console.log(id, "clear");
      clearInterval(id);
    };
  }, []);
  return (
    <div>
      <div>{format(fixedDate, "HH:mm:ss.SSS")}</div>
      <div>{format(date, "HH:mm:ss.SSS")}</div>
    </div>
  );
}

export function getStaticProps() {
  return {
    notFound: process.env.NEXT_PULIC_ENV !== "local",
  };
}
