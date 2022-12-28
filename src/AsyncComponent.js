import React, { useState } from "react";
import usePendingFunction from "./usePendingFunction";

const AsyncComponent = () => {
  const [inputValue, setInputValue] = useState("빈값");

  const getData = async () => {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(`${Date.now() + Math.random()}`);
      }, 1000);
    }).then((value) => setInputValue(value));
  };

  const [isPending, startFunc] = usePendingFunction(getData, 100);

  return (
    <div>
      <div>{inputValue}</div>
      <button onClick={startFunc} disabled={isPending}>
        함수실행
      </button>
    </div>
  );
};

export default AsyncComponent;
