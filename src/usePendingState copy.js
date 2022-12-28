import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";

/**
 * @type { (func: Function | Promise) => {boolean, Function, any} } usePendingState
 */
const usePendingState = (func) => {
  if (typeof func !== "function" && !(func instanceof Promise)) {
    throw new Error("func must be a function or a promise");
  }
  const [isPending, setIsPending] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const [bool, setBool] = useState(undefined);
  const deferredBool = useDeferredValue(bool);

  const startFunc = () => {
    setTrigger((prev) => !prev);
  };

  const memoValue = useMemo(() => {
    console.log("memoValue");
    // if (isPending) {
    if (func instanceof Promise) {
      func.finally(() => {});
      return Math.random();
    } else if (typeof func === "function") {
      const result = func();
      return result;
    } else {
      throw new Error("func must be a function or a promise");
    }
    // }
  }, [deferredBool]);

  useEffect(() => {
    if (bool === undefined) {
      setBool(false);
      return;
    }
    if (!isPending) {
      setIsPending(true);
      setBool((prev) => !prev);
    }
  }, [trigger]);

  useEffect(() => {
    setIsPending(false);
  }, [memoValue]);

  return [isPending, startFunc, memoValue];
};

export default usePendingState;
