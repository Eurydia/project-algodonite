import { useCallback } from "react";

export const useFormatNumber = () => {
  const formatter = useCallback(
    (n: number, parenNegative: boolean = false) => {
      return n < 0 && parenNegative
        ? `(${n})`
        : n.toString();
    },
    []
  );
  return formatter;
};
