export const makeQuantileItem = (
  dataSorted: number[],
  r: number
) => {
  const pos = r * ((dataSorted.length + 1) / 4);
  const decimal = pos - Math.floor(pos);

  const posLeft = Math.floor(pos) - 1;
  const posRight = Math.ceil(pos) - 1;

  const valueLeft = dataSorted[posLeft];
  const valueRight = dataSorted[posRight];

  const posSet = new Set([posLeft, posRight]);

  const value =
    valueLeft + decimal * Math.abs(valueLeft - valueRight);

  return {
    label: `ควอร์ไทล์ที่ ${r}`,
    value: isNaN(value) ? undefined : value,
    expr: `Q_{${r}}&=\\frac{${r}}{4}(N+1)`,
    exprExt: isNaN(value)
      ? undefined
      : `&=\\frac{${r}\\cdot${dataSorted.length + 1}}{4}
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
        \\\\&=${
          dataSorted[Math.floor(pos) - 1]
        } + (${decimal} \\cdot|${
          dataSorted[Math.ceil(pos) - 1]
        } - ${dataSorted[Math.floor(pos) - 1]} |)`,
  };
};

export const makePercentileItem = (
  dataSorted: number[],
  r: number
) => {
  const pos = r * ((dataSorted.length + 1) / 100);
  const decimal = pos - Math.floor(pos);

  const posLeft = Math.floor(pos) - 1;
  const posRight = Math.ceil(pos) - 1;

  const valueLeft = dataSorted[posLeft];
  const valueRight = dataSorted[posRight];

  const posSet = new Set([posLeft, posRight]);

  const value =
    valueLeft + decimal * Math.abs(valueLeft - valueRight);

  return {
    label: `เปอร์เซ็นไทล์ที่ ${r}`,
    value: isNaN(value) ? undefined : value,
    expr: `P_{${r}}&=\\frac{${r}}{100}(N+1)`,
    exprExt: isNaN(value)
      ? undefined
      : `&=\\frac{${r}\\cdot${dataSorted.length + 1}}{4}
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
        \\\\&=${
          dataSorted[Math.floor(pos) - 1]
        } + (${decimal} \\cdot|${
          dataSorted[Math.ceil(pos) - 1]
        } - ${dataSorted[Math.floor(pos) - 1]} |)`,
  };
};
