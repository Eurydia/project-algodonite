import { Box, Stack, Typography } from "@mui/material";
import { max, median, rollup, sum } from "d3-array";
import { useMemo, type FC } from "react";
import { StatItem } from "./StatItem";

type Props = {
  data: number[];
  dataOrigin: "sample" | "population";
};
export const CentralStatsDisplay: FC<Props> = ({
  data,
  dataOrigin,
}) => {
  const stat = useMemo(() => {
    const dataSum = sum(data);
    const size = data.length;

    let dataMean: number | undefined;
    if (size > 0) {
      dataMean = dataSum / size;
    }
    const dataSorted = [...data].sort((a, b) => a - b);

    const dataMedian = median(data);

    const counts = rollup(
      data,
      (v) => v.length,
      (d) => d
    );
    const maxCount = max(counts.values());

    const dataMode = Array.from(counts)
      .filter(([, count]) => count === maxCount)
      .map(([value]) => value);

    return [
      {
        label:
          dataOrigin === "sample"
            ? `ค่าเฉลี่ย $\\overline{x}$`
            : `ค่าเฉลี่ย $\\mu$`,
        value: dataMean,
        expr:
          dataOrigin === "sample"
            ? `\\overline{x}&=\\frac{1}{n}\\sum_{i=1}^{n} x_{i}`
            : `\\mu&=\\frac{1}{N}\\sum_{i=1}^{N} x_{i}`,
        exprExt:
          dataMean === undefined
            ? undefined
            : `&=\\frac{1}{${size}}(${dataSum})`,
      },
      {
        label: "มัธยฐาน",
        value: dataMedian,
        expr:
          dataMedian === undefined
            ? undefined
            : `&=\\begin{matrix} \\langle${dataSorted
                .map((datum, index) => {
                  let fmt =
                    datum.toLocaleString("fullwide");
                  const mid = (size + 1) / 2;
                  if (
                    index + 1 === Math.ceil(mid) ||
                    index + 1 === Math.floor(mid)
                  ) {
                    fmt = `\\underline{${fmt}}`;
                  }
                  return fmt;
                })
                .join(",&")}\\rangle \\end{matrix}`,
      },
      {
        label: "ฐานนิยม",
        value: dataMode.length > 1 ? "-" : dataMode[0],
      },
    ];
  }, [data, dataOrigin]);

  return (
    <Box>
      <Typography
        component="div"
        variant="h5"
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
        }}
      >
        ค่ากลางของข้อมูล
      </Typography>

      <Stack
        spacing={1}
        useFlexGap
        flexWrap="wrap"
      >
        {stat.map((data, index) => (
          <StatItem
            key={`stat-item-${index}`}
            {...data}
          />
        ))}
      </Stack>
    </Box>
  );
};
