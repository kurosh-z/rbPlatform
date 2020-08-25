var e10 = Math.sqrt(50),
  e5 = Math.sqrt(10),
  e2 = Math.sqrt(2);

//source: https://github.com/d3/d3-array/blob/master/src/ticks.js
export const linspace = ({
  start,
  stop,
  num = 10,
}: {
  start: number;
  stop: number;
  num?: number;
}) => {
  let i = -1,
    n,
    step,
    ticks;

  // (stop = +stop), (start = +start), (num = +num);
  if (start === stop && num > 0) return [start];
  if ((step = tickIncrement(start, stop, num)) === 0 || !isFinite(step))
    return [];
  if (stop < start) {
    throw new Error('stop cannot be smaller than start!');
  }

  if (step > 0) {
    start = Math.ceil(start / step);
    stop = Math.floor(stop / step);
    ticks = new Array((n = Math.ceil(stop - start + 1)));
    while (++i < n) ticks[i] = (start + i) * step;
  } else {
    step = -step;
    start = Math.ceil(start * step);
    stop = Math.floor(stop * step);
    ticks = new Array((n = Math.ceil(stop - start + 1)));
    while (++i < n) ticks[i] = (start + i) / step;
  }
  return ticks;
};

//source: https://github.com/d3/d3-array/blob/master/src/ticks.js
export function tickIncrement(start: number, stop: number, num: number) {
  var step = (stop - start) / Math.max(0, num),
    power = Math.floor(Math.log(step) / Math.LN10),
    error = step / Math.pow(10, power);
  return power >= 0
    ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) *
        Math.pow(10, power)
    : -Math.pow(10, -power) /
        (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
}
