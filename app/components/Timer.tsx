"use client";
import React, { useEffect, useState } from "react";

const Timer = ({
  end,
  time,
  quizStarted,
}: {
  time: number | null;
  end: () => void;
  quizStarted: boolean;
}) => {
  const [timer, setTimer] = useState<number | null>(time);
  useEffect(() => {
    const interval = setInterval(() => {
      if (quizStarted) {
        setTimer((prev) => (prev ? prev - 1 : prev));
        if (timer! - 1 === 0) end();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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
