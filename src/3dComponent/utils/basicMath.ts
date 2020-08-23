import { isNumber } from './isFunctions';

export const linspace = ({
  start,
  stop,
  num,
  step = 1,
}: {
  start: number;
  stop: number;
  num?: number;
  step?: number;
}) => {
  if (stop < start) {
    throw new Error('stop cannot be smaller than start!');
  }
  let _step: number;
  if (isNumber(num)) {
    _step = Math.abs(stop - start) / (num as number);
  } else {
    _step = step;
  }

  let el = start;
  const res = [start];
  while (el < stop) {
    el += _step;
    res.push(el);
  }
  return res;
};
