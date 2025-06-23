export const getQuantile = (
  orderedDataset: number[],
  r: number
) => {
  if (orderedDataset.length < 4) {
    return undefined;
  }

  const size = orderedDataset.length + 1;
  const pos = r * (size / 4);
  const decimal = pos - Math.floor(pos);

  const posLeft = Math.max(Math.floor(pos) - 1, 0);
  const posRight = Math.min(size - 2, Math.ceil(pos) - 1);

  const valueLeft = orderedDataset[posLeft];
  const valueRight = orderedDataset[posRight];
  const value =
    valueLeft + decimal * Math.abs(valueLeft - valueRight);
  return { value, posLeft, posRight, decimal };
};

export const getPercentile = (
  orderedDataset: number[],
  r: number
) => {
  if (orderedDataset.length < 2) {
    return undefined;
  }

  const size = orderedDataset.length + 1;
  const pos = r * (size / 100);
  const decimal = pos - Math.floor(pos);

  const posLeft = Math.max(Math.floor(pos) - 1, 0);
  const posRight = Math.min(size - 2, Math.ceil(pos) - 1);

  const valueLeft = orderedDataset[posLeft];
  const valueRight = orderedDataset[posRight];
  const value =
    valueLeft + decimal * Math.abs(valueLeft - valueRight);
  return { value, posLeft, posRight, decimal };
};
