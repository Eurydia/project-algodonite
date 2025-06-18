import { Box, Stack, Typography } from "@mui/material";
import { quantile } from "d3-array";
import { useMemo, type FC } from "react";

type Props = {
  data: number[];
};
export const PositionStatsDisplay: FC<Props> = ({
  data,
}) => {
  const stat = useMemo(() => {
    const q1 = quantile(data, 0.25);
    const median = quantile(data, 0.5);
    const q3 = quantile(data, 0.75);
    const iqr =
      q1 != null && q3 != null ? q3 - q1 : undefined;

    return {
      "ควอร์ไทล์ที่ 1": q1,
      "ควอร์ไทล์ที่ 2": median,
      "ควอร์ไทล์ที่ 3": q3,
      "พิสัยระหว่างควอร์ไทล์": iqr,
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
