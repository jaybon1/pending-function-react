import { useDeferredValue, useEffect, useMemo, useState } from "react";

/**
 * @type { (func: Function | Promise) => [boolean, Function, any?] } usePendingState
 */
const usePendingState = (func) => {
  const [isPending, setIsPending] = useState(false);

  const [pendingStarter, setPenidngStarter] = useState(false);
  const [pendingEnder, setPendingEnder] = useState(0);

  const [memoStarter, setMemoStarter] = useState(undefined);
  const deferredMemoStarter = useDeferredValue(memoStarter);

  const startFunc = () => {
    setPenidngStarter((prev) => !prev);
  };

  useEffect(() => {
    if (memoStarter === undefined) {
      setMemoStarter(false);
    } else if (!isPending) {
      setIsPending(true);
      setMemoStarter((prev) => !prev);
    }
  }, [pendingStarter]);

  const memoValue = useMemo(() => {
    if (isPending) {
      if (func instanceof Promise) {
        func.finally(() => {
          setPendingEnder(Date.now() + Math.random());
        });
        return undefined;
      } else if (typeof func === "function") {
        console.log("func === function");
        const result = func();
        setPendingEnder(Date.now() + Math.random());
        return result;
      } else {
        throw new Error("func must be a function or a promise");
      }
    }
  }, [deferredMemoStarter]);

  useEffect(() => {
    setIsPending(false);
  }, [pendingEnder]);

  if (func instanceof Promise) {
    return [isPending, startFunc];
  } else if (typeof func === "function") {
    return [isPending, startFunc, memoValue];
  } else {
    return [];
  }
};

export default usePendingState;
