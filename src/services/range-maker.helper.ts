export function niceNum(range: number, round: boolean) {
  const exp = Math.floor(Math.log10(range));
  const frac = range / Math.pow(10, exp);
  let nf;
  if (round) {
    if (frac < 1.5) nf = 1;
    else if (frac < 3) nf = 2;
    else if (frac < 7) nf = 5;
    else nf = 10;
  } else {
    if (frac <= 1) nf = 1;
    else if (frac <= 2) nf = 2;
    else if (frac <= 5) nf = 5;
    else nf = 10;
  }
  return nf * Math.pow(10, exp);
}

export function niceScale(
  min: number,
  max: number,
  maxTicks = 10
): [number, number] {
  const range = max - min;
  const niceRange = niceNum(range, false);
  const tickStep = niceNum(
    niceRange / (maxTicks - 1),
    true
  );
  const niceMin = Math.floor(min / tickStep) * tickStep;
  const niceMax = Math.ceil(max / tickStep) * tickStep;
  return [niceMin, niceMax];
}
