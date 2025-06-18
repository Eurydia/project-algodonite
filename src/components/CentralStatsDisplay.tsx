import { Box, Stack, Typography } from "@mui/material";
import { mean, median, mode } from "d3-array";
import { useMemo, type FC } from "react";

type Props = {
  data: number[];
};
export const CentralStatsDisplay: FC<Props> = ({
  data,
}) => {
  const stat = useMemo(() => {
    return {
      mean: data.length > 0 ? mean(data) ?? null : null,
      mode: data.length > 0 ? mode(data) : null,
      median: data.length > 0 ? median(data) ?? null : null,
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
        ค่ากลางของข้อมูล
      </Typography>
      <Stack
        spacing={1}
        useFlexGap
        flexWrap="wrap"
      >
        <Stack
          spacing={1}
          direction="row"
          flexWrap="wrap"
          useFlexGap
        >
          <Typography>{`ค่าเฉลี่ย:`}</Typography>
          <Typography>
            {stat.mean === null
              ? "ไม่มีข้อมูล"
              : stat.mean.toLocaleString("fullwide")}
          </Typography>
        </Stack>
        <Stack
          spacing={1}
          direction="row"
          flexWrap="wrap"
          useFlexGap
        >
          <Typography>{`มัธยฐาน:`}</Typography>
          <Typography>
            {stat.median === null
              ? "ไม่มีข้อมูล"
              : stat.median.toLocaleString("fullwide")}
          </Typography>
        </Stack>
        <Stack
          spacing={1}
          direction="row"
          flexWrap="wrap"
          useFlexGap
        >
          <Typography>{`ฐานนิยม:`}</Typography>
          <Typography>
            {stat.mode === null
              ? "ไม่มีข้อมูล"
              : stat.mode.toLocaleString("fullwide")}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};
