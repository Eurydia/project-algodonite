export const makeQuantileItem = (
  dataSorted: number[],
  r: number
) => {
  const size = dataSorted.length + 1;
  const pos = r * (size / 4);
  const decimal = pos - Math.floor(pos);

  const posLeft = Math.max(Math.floor(pos) - 1, 0);
  const posRight = Math.min(size - 2, Math.ceil(pos) - 1);

  const valueLeft = dataSorted[posLeft];
  const valueRight = dataSorted[posRight];

  const posSet = new Set([posLeft, posRight]);

  const value =
    valueLeft + decimal * Math.abs(valueLeft - valueRight);

  return {
    label: `ควอร์ไทล์ที่ $${r}$`,
    value: isNaN(value) ? undefined : value,
    expr: `Q_{${r}}&=\\frac{${r}}{4}(N+1)`,
    exprExt: isNaN(value)
      ? undefined
      : `&=\\frac{${r}\\cdot${size}}{4}
        \\\\&=${pos}
        \\\\&\\langle\\begin{matrix}
        ${dataSorted
          .map((datum, index) => {
            let fmt = datum.toLocaleString("fullwide");
            if (posSet.has(index)) {
              fmt = `\\underline{${fmt}}`;
            }
            return fmt;
          })
          .join(",&")}\\rangle\\end{matrix}
        \\\\&=${valueLeft} + (${decimal} \\cdot|${valueRight} - ${valueLeft} |)`,
  };
};

export const makePercentileItem = (
  dataSorted: number[],
  r: number
) => {
  const size = dataSorted.length + 1;
  const pos = (r / 100) * size;
  const decimal = pos - Math.floor(pos);

  const posLeft = Math.max(0, Math.floor(pos) - 1);
  const posRight = Math.min(size - 2, Math.ceil(pos) - 1);

  const valueLeft = dataSorted[posLeft];
  const valueRight = dataSorted[posRight];

  const posSet = new Set([posLeft, posRight]);

  const value =
    valueLeft + decimal * Math.abs(valueLeft - valueRight);

  return {
    label: `เปอร์เซ็นไทล์ที่ $${r}$`,
    value: isNaN(value) ? undefined : value,
    expr: `P_{${r}}&=\\frac{${r}}{100}(N+1)`,
    exprExt: isNaN(value)
      ? undefined
      : `&=\\frac{${r}\\cdot${size}}{100}
        \\\\&=${pos}
        \\\\&\\langle\\begin{matrix}
        ${dataSorted
          .map((datum, index) => {
            let fmt = datum.toLocaleString("fullwide");
            if (posSet.has(index)) {
              fmt = `\\underline{${fmt}}`;
            }
            return fmt;
          })
          .join(",&")}\\rangle\\end{matrix}
        \\\\&=${valueLeft} + (${decimal} \\cdot|${valueLeft} - ${valueLeft}|)`,
  };
};
