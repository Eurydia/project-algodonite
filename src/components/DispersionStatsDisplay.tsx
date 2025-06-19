import { Box, Stack, Typography } from "@mui/material";
import { extent, mean, quantile, sum } from "d3-array";
import { memo, useMemo, type FC } from "react";
import { StatItem } from "./StatItem";

type Props = {
  data: number[];
  isPopulation: boolean;
};
export const DispersionStatsDisplay: FC<Props> = memo(
  ({ data, isPopulation }) => {
    const stat = useMemo(() => {
      const [min, max] = extent(data);
      let range: number | undefined;
      if (min !== undefined && max !== undefined) {
        range = max - min;
      }
      const mu = mean(data);
      const size = isPopulation
        ? data.length
        : data.length - 1;

      let sumSqDiff: number | undefined;
      if (mu !== undefined) {
        sumSqDiff = sum(
          data.map((datum) => Math.pow(datum - mu, 2))
        );
      }

      let std: number | undefined;
      if (sumSqDiff !== undefined && size > 0) {
        std = Math.sqrt(sumSqDiff / size);
      }

      let var_: number | undefined;
      if (std !== undefined) {
        var_ = Math.pow(std, 2);
      }

      let cv: number | undefined;
      if (std && mu) {
        cv = std / Math.abs(mu);
      }

      const q25 = quantile(data, 0.25);
      const q75 = quantile(data, 0.75);
      let iqr: number | undefined;
      if (q25 !== undefined && q75 !== undefined) {
        iqr = q75 - q25;
      }

      return [
        {
          label: "พิสัย $R$",
          value: range,
          expr: `R &= x_{\\text{max}} - x_{\\text{min}}`,
          exprExt:
            range !== undefined
              ? `&=${max?.toLocaleString(
                  "fullwide"
                )} - ${min?.toLocaleString("fullwide")}`
              : undefined,
        },
        {
          label: "พิสัยระหว่างควอร์ไทล์ $\\text{IQR}$",
          value: iqr,
          exprExt:
            iqr !== undefined
              ? `&=${q75?.toLocaleString(
                  "fullwide"
                )} - ${q25?.toLocaleString("fullwide")}`
              : undefined,
          expr: `\\text{IQR} &= Q_{3} - Q_{1}`,
        },
        {
          label: isPopulation
            ? `ส่วนเบี่ยงเบนมาตรฐาน $\\sigma$`
            : `ส่วนเบี่ยงเบนมาตรฐาน $s$`,
          value: std,
          exprExt:
            std !== undefined
              ? `
            &=\\sqrt{\\frac{1}{${size.toLocaleString(
              "fullwide"
            )}} (${sumSqDiff?.toLocaleString(
                  "fullwide"
                )}) }\\\\
              &=\\sqrt{${(sumSqDiff! / size).toLocaleString(
                "fullwide"
              )}}`
              : undefined,
          expr: isPopulation
            ? `\\sigma &= \\sqrt{\\frac{1}{N} \\sum_{i=1}^{N} (x_{i} - \\mu)^{2} }`
            : `s &= \\sqrt{\\frac{1}{n-1} \\sum_{i=1}^{n} (x_{i} - \\overline{x})^{2} }`,
        },
        {
          label: isPopulation
            ? `ค่าความแปรปรวน $\\sigma^{2}$`
            : `ค่าความแปรปรวน $s^2$`,
          expr: isPopulation ? `&=\\sigma^{2}` : `&=s^2`,
          value: var_,
        },
        {
          label: `สัมประสิทธิ์ของการแปรผัน $\\text{CV}$`,
          value: cv,
          exprExt:
            cv !== undefined
              ? `&=\\frac{${std?.toLocaleString(
                  "fullwide"
                )}}{|${mu?.toLocaleString("fullwide")}|}`
              : undefined,
          expr: isPopulation
            ? `\\text{CV}&=\\frac{\\sigma}{|\\mu|}`
            : `\\text{CV}&=\\frac{s}{|\\overline{x}|}`,
        },
      ];
    }, [data, isPopulation]);

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
          ค่าวัดการกระจาย
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
  }
);
