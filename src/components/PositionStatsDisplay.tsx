import {
  makePercentileItem,
  makeQuantileItem,
} from "@/services/make-quantile-item.helper";
import {
  Box,
  Grid,
  Input,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo, useState, type FC } from "react";
import { StatItem } from "./StatItem";

type Props = {
  data: number[];
  dataOrigin: "population" | "sample";
};
export const PositionStatsDisplay: FC<Props> = ({
  data,
  dataOrigin,
}) => {
  const [percentile, setPercentile] = useState(50);

  const stat = useMemo(() => {
    const dataSorted = [...data];
    dataSorted.sort((a, b) => a - b);

    return [
      makeQuantileItem(dataSorted, 1, dataOrigin),
      makeQuantileItem(dataSorted, 2, dataOrigin),
      makeQuantileItem(dataSorted, 3, dataOrigin),
    ];
  }, [data, dataOrigin]);

  const percentileItem = useMemo(() => {
    const q = [...data].sort((a, b) => a - b);
    return makePercentileItem(q, percentile, dataOrigin);
  }, [data, dataOrigin, percentile]);

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
        ค่าวัดตำแหน่งของข้อมูล
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
        <Typography gutterBottom>เปอร์เซ็นไทล์</Typography>
      </Stack>
      <Box>
        <Grid
          container
          spacing={2}
        >
          <Grid size="grow">
            <Slider
              max={99}
              min={1}
              value={percentile}
              onChange={(_, v) => setPercentile(v)}
            />
          </Grid>
          <Grid size={2}>
            <Input
              value={percentile}
              size="small"
              onChange={(e) => {
                const v =
                  e.target.value === ""
                    ? 0
                    : Number(e.target.value);
                setPercentile(Math.max(Math.min(99, v), 1));
              }}
              onBlur={() => {
                if (percentile < 0) {
                  setPercentile(0);
                } else if (percentile > 100) {
                  setPercentile(100);
                }
              }}
              inputProps={{
                step: 1,
                min: 1,
                max: 99,
                type: "number",
              }}
            />
          </Grid>
        </Grid>
      </Box>
      <StatItem {...percentileItem} />
    </Box>
  );
};
