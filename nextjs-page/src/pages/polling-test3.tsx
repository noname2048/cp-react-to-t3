import {format} from "date-fns";
import React, {useEffect, useRef, useState} from "react";

const initDate = new Date(2023, 1, 1, 0, 0, 0);

export default function PollingTest2() {
  const [date01, setDate01] = useState(initDate);
  const [date02, setDate02] = useState(initDate); // 1초 마다 업데이트
  const [date03, setDate03] = useState(initDate); // 01m10s, 02m10s, 03m10s ... 마다 업데이트

  const date02Ref = useRef<NodeJS.Timer | null>(null);
  const date03Ref = useRef<NodeJS.Timer | null>(null);

  const clear02Ref = () => {
    if (date02Ref.current) {
      clearInterval(date02Ref.current);
      console.log("clearDateInterval", date02Ref.current);
      date02Ref.current = null;
    }
  };

  const clear03Ref = () => {
    if (date03Ref.current) {
      clearInterval(date03Ref.current);
      console.log("clearDateInterval", date03Ref.current);
      date03Ref.current = null;
    }
  };

  const set02Ref = (id: NodeJS.Timer) => {
    if (date02Ref.current) {
      clear02Ref();
    }
    console.log("set02Ref", id);
    date02Ref.current = id;
  };

  const set03Ref = (id: NodeJS.Timer) => {
    if (date03Ref.current) {
      clear03Ref();
    }
    console.log("set03Ref", id);
    date03Ref.current = id;
  };

  console.log("render");

  useEffect(() => {
    console.log("effect A");

    setDate01(new Date());
    const interval = setInterval(() => {
      console.log("interval A");
      setDate02(new Date());
    }, 1000);
    set02Ref(interval);

    return () => {
      clear02Ref();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log("effect B");

    const NextTimeToExecute = (5 - (new Date().getSeconds() % 5)) * 1000;
    console.log("NextTimeToExecute", NextTimeToExecute);

    const timeout = setTimeout(() => {
      console.log("timeout B");
      const interval = setInterval(() => {
        console.log("interval B", interval);
        setDate03(new Date());
      }, 5000);
      set03Ref(interval);
    }, NextTimeToExecute);
    return () => {
      console.log("clearTimeout", timeout);
      clearTimeout(timeout);
      clear03Ref();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div>
        {format(date01, "HH:mm:ss.SSS")}
        <span className="px-2">처음</span>
      </div>
      <div>
        {format(date02, "HH:mm:ss.SSS")}
        <span className="px-2">1초마다</span>
      </div>
      <div>
        {format(date03, "HH:mm:ss.SSS")}
        <span className="px-2">5초에 맞춰</span>
      </div>
    </div>
  );
}

export function getStaticProps() {
  return {
    props: {},
    notFound: process.env.NEXT_PUBLIC_ENV !== "local",
  };
}
