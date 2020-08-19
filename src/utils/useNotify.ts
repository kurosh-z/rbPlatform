import { useState, useCallback, useRef } from 'react';

export const useNotify: <T>() => [
  T,
  React.MutableRefObject<(newVal: T) => void>
] = function () {
  const [val, setVal] = useState(null);
  const cb = useCallback((newVal) => {
    setVal(() => newVal);
  }, []);
  const cbRef = useRef(cb);

  return [val, cbRef];
};
