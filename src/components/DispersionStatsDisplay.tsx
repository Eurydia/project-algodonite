import { Box, Stack, Typography } from "@mui/material";
import { deviation, mean, variance } from "d3-array";
import { useMemo, type FC } from "react";

type Props = {
  data: number[];
};
export const DispersionStatsDisplay: FC<Props> = ({
  data,
}) => {
  const stat = useMemo(() => {
    const var_ = variance(data);
    const std = deviation(data);
    let mad: number | undefined;
    const mu = mean(data);
    if (mu) {
      mad = mean(data.map((datum) => Math.abs(datum - mu)));
    }
    let cv: number | undefined;
    if (std && mu) {
      cv = std / mu;
    }

    let rMad: number | undefined;
    if (mad && mu) {
      rMad = mad / mu;
    }

    return {
      ค่าความแปรปรวน: var_,
      ส่วนเบี่ยงเบนมาตรฐาน: std,
      ค่าเฉลี่ยของส่วนเบี่ยงเบนสัมบูรณ์: mad,
      ค่าสัมประสิทธิ์ของการแปรปรวน: cv,
      สัมประสิทธิ์ของส่วนเบี่ยงเบนเฉลี่ย: rMad,
    };
  }, [data]);

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
        {Object.entries(stat).map(([k, value], index) => (
          <Stack
            key={`stat-item-${index}`}
            spacing={1}
            direction="row"
            flexWrap="wrap"
            useFlexGap
          >
            <Typography>{`${k}:`}</Typography>
            <Typography>
              {value === undefined
                ? "ไม่มีข้อมูล"
                : value.toLocaleString("fullwide")}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};
