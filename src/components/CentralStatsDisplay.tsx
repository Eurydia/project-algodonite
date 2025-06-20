import { Box, Stack, Typography } from "@mui/material";
import { max, mean, median, rollup, sum } from "d3-array";
import { memo, useMemo, type FC } from "react";
import { StatItem } from "./StatItem";

type Props = {
  dataSorted: number[];
  isPopulation: boolean;
};
export const CentralStatsDisplay: FC<Props> = memo(
  ({ dataSorted, isPopulation }) => {
    const statMean = useMemo(() => {
      const size = dataSorted.length;
      const dtSum = sum(dataSorted);

      const dataMean = mean(dataSorted);

      return {
        label: !isPopulation
          ? `ค่าเฉลี่ย $\\overline{x}$`
          : `ค่าเฉลี่ย $\\mu$`,
        value: dataMean,
        expr: !isPopulation
          ? `\\overline{x}&=\\frac{1}{n}\\sum_{i=1}^{n} x_{i}`
          : `\\mu&=\\frac{1}{N}\\sum_{i=1}^{N} x_{i}`,
        exprExt:
          dataMean === undefined
            ? undefined
            : `&=\\frac{1}{${size}}(${dtSum})`,
      };
    }, [dataSorted, isPopulation]);

    const statMedian = useMemo(() => {
      const dtMedian = median(dataSorted);
      const size = dataSorted.length;
      const mid = (size + 1) / 2 - 1;
      const left = Math.floor(mid);
      const right = Math.ceil(mid);

      const idx = new Set([left, right]);
      const itemMsg = dataSorted
        .map((datum, index) => {
          const fmt = datum.toLocaleString("fullwide");
          return idx.has(index)
            ? `\\underline{${fmt}}`
            : fmt;
        })
        .join(",&");

      return {
        label: "มัธยฐาน",
        value: dtMedian,
        expr:
          dtMedian === undefined
            ? undefined
            : `&=\\begin{matrix} \\langle${itemMsg}\\rangle \\end{matrix}`,
      };
    }, [dataSorted]);

    const statMode = useMemo(() => {
      const counts = rollup(
        dataSorted,
        (v) => v.length,
        (d) => d
      );
      const maxCount = max(counts.values());

      const dataMode = Array.from(counts)
        .filter(([, count]) => count === maxCount)
        .map(([value]) => value);

      return {
        label: "ฐานนิยม",
        value: dataMode.length > 1 ? "-" : dataMode[0],
      };
    }, [dataSorted]);

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
          <StatItem {...statMean} />
          <StatItem {...statMedian} />
          <StatItem {...statMode} />
        </Stack>
      </Box>
    );
  }
);
