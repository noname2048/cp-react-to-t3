// setTimeout 과 setInterval 을 복잡적으로 사용하여 cronjob의 구현
// 매 5초 (00, 05, 10 ...)마다 업데이트를 실행함
// (본래 목적은 매분 05 마다 업데이트 실행, 01:05, 02:05, 03:05 ...)

import React, { useState, useEffect, useRef } from "react";
import { format } from "date-fns";

export default function PollingTest2() {
  const [fixedDate, setFixedDate] = useState(new Date(2023, 1, 1, 0, 0, 0));
  const [date, setDate] = useState(new Date(2023, 1, 1, 0, 0, 0));
  const ref = useRef<NodeJS.Timer | null>(null);

  console.log("render");
  useEffect(() => {
    console.log("effect");
    setFixedDate(new Date());
    const NextTimeToExecute = (5 - (new Date().getSeconds() % 5)) * 1000;
    console.log("NextTimeToExecute", NextTimeToExecute);
    const timeout = setTimeout(() => {
      if (ref.current) {
        clearInterval(ref.current);
        console.log("clearInterval", ref.current);
        ref.current = null;
      }
      const interval = setInterval(() => {
        console.log("interval", interval);
        setDate(new Date());
      }, 5000);
      console.log("setInterval", interval);
      ref.current = interval;
    }, NextTimeToExecute);
    console.log("setTimeout", timeout);
    return () => {
      console.log("clearTimeout", timeout);
      clearTimeout(timeout);
      if (ref.current) {
        console.log("clearInterval", ref.current);
        clearInterval(ref.current);
        ref.current = null;
      }
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
