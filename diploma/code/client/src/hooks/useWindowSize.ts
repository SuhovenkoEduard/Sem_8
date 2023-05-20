import { useLayoutEffect, useState } from "react";

export const useWindowSize = (): [number, number] => {
  const [size, setSize] = useState<[number, number]>([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([document.body.clientWidth, document.body.clientHeight]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
};
