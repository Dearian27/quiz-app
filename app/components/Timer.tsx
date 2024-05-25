"use client";
import React, { useEffect, useRef, useState } from "react";

const Timer = ({
  time,
  submitTest,
}: {
  time: number | null;
  submitTest: () => void;
}) => {
  const [timer, setTimer] = useState<number | null>(time);
  const timerRef = useRef(timer);

  useEffect(() => {
    timerRef.current = timer;
  }, [timer]);

  useEffect(() => {
    if (timer === null) return;

    const interval = setInterval(() => {
      if (timerRef.current !== null) {
        if (timerRef.current == 0) {
          clearInterval(interval);
          submitTest();
        } else {
          setTimer((prev) => (prev !== null ? prev - 1 : prev));
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [submitTest]);

  if (time === null || timer === null) return null;

  return (
    <div className="font-bold text-lg px-6">
      <span>
        {String(Math.floor(timer / 60)).length < 2
          ? `0${Math.floor(timer / 60)}`
          : Math.floor(timer / 60)}
      </span>
      :
      <span>
        {String(Math.floor(timer % 60)).length < 2
          ? `0${Math.floor(timer % 60)}`
          : Math.floor(timer % 60)}
      </span>
    </div>
  );
};

export default Timer;
