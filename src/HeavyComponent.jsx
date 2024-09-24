import React, { useCallback, useState } from "react";
import SlowList from "./SlowList";
import usePendingFunction from "./usePendingFunction";

const HeavyComponent = () => {
  const [inputValue, setInputValue] = useState("");

  const Slow = useCallback(() => {
    return <SlowList text={inputValue} />;
  }, [inputValue]);

  const [isPending, startFunc, memoValue] = usePendingFunction(Slow);

  const onChange = (e) => {
    const input = e.target.value;

    // 긴급 업데이트: 타이핑 결과를 보여준다.
    setInputValue(input);
    // 지연 업데이트
    startFunc();
  };

  return (
    <div>
      <input value={inputValue} onChange={onChange} />
      <div>{String(isPending)}</div>
      {memoValue}
    </div>
  );
};

export default HeavyComponent;
