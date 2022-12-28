import { useDeferredValue, useEffect, useMemo, useState } from "react";

/**
 * 함수를 실행하고, 대기 상태 및 결과를 반환하는 Hook
 * 성능 최적화를 위해 지연로딩을 사용한다.
 * @type { (func: Function, msDelay : number | undefined) => [boolean, Function, any] } usePendingState
 */
const usePendingFunction = (func, msDelay) => {
  // 함수가 실행되고 있는지 여부
  const [isPending, setIsPending] = useState(false);

  // 대기 상태 시작 트리거
  const [pendingStarter, setPenidngStarter] = useState(false);
  // 대기 상태 종료 트리거
  const [pendingEnder, setPendingEnder] = useState(false);

  // useMemo를 실행하기 위한 트리거
  // 초기값은 undefined / 이후 값은 boolean
  const [memoStarter, setMemoStarter] = useState(undefined);

  // 지연로딩을 위한 Hook
  // memoStarter를 지연로딩하기 위해 deferredMemoStarter를 사용한다.
  const deferredMemoStarter = useDeferredValue(memoStarter);

  // 매개변수로 받은 함수 실행을 위해 리턴할 함수
  const startFunc = () => {
    setPenidngStarter((prev) => !prev);
  };

  // 처음 실행될 때, memoStarter를 false로 변경한다.
  // pendingStarter가 동작하면, isPending를 true로 변경하고, memoStarter를 동작시킨다.
  useEffect(() => {
    if (memoStarter === undefined) {
      setMemoStarter(false);
    } else if (!isPending) {
      setIsPending(true);
      setMemoStarter((prev) => !prev);
    }
  }, [pendingStarter]);

  // 지연로딩된 deferredMemoStarter가 동작하면, 함수를 실행한다.
  // pending 상태가 아닐 경우, 함수를 실행하지 않는다.
  // func 매개변수가 함수가 아닐 경우, 에러를 발생시킨다.
  // 함수 실행 결과가 Promise가 아니라면, 대기 상태를 종료한다.
  // 함수 실행 결과가 Promise라면, Promise가 종료될 때까지 대기한다.
  // 함수가 완료되면 pendingEnder를 동작시킨다.
  const memoValue = useMemo(() => {
    if (!isPending) return undefined;
    if (!(typeof func === "function")) {
      throw new Error("func must be a function");
    }
    const result = func();
    if (result instanceof Promise) {
      result.finally(() => {
        setPendingEnder((prev) => !prev);
      });
      return undefined;
    } else {
      setPendingEnder((prev) => !prev);
      return result;
    }
  }, [deferredMemoStarter]);

  // pendingEnder가 동작하면, isPending를 false로 변경한다.
  useEffect(() => {
    if (isPending) {
      setTimeout(() => setIsPending(false), msDelay);
    }
  }, [pendingEnder, msDelay]);

  // startFunc으로 함수를 실행하고, isPending으로 대기상태를 확인하고, memoValue로 결과를 확인할 수 있다.
  return [isPending, startFunc, memoValue];
};

export default usePendingFunction;
