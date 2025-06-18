import {
  makePercentileItem,
  makeQuantileItem,
} from "@/services/make-quantile-item.helper";
import { PercentRounded } from "@mui/icons-material";
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
};
export const PositionStatsDisplay: FC<Props> = ({
  data,
}) => {
  const [percentile, setPercentile] = useState(50);

  const stat = useMemo(() => {
    const dataSorted = [...data].sort();

    return [
      makeQuantileItem(dataSorted, 1),
      makeQuantileItem(dataSorted, 2),
      makeQuantileItem(dataSorted, 3),
    ];
  }, [data]);

  const percentileItem = useMemo(() => {
    return makePercentileItem([...data].sort(), percentile);
  }, [data, percentile]);

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
      <Typography gutterBottom>เปอร์เซ็นไทล์</Typography>
      <Grid
        container
        spacing={2}
        sx={{ alignItems: "center" }}
      >
        <Grid>
          <PercentRounded />
        </Grid>
        <Grid size="grow">
          <Slider
            value={percentile}
            onChange={(_, v) => setPercentile(v)}
          />
        </Grid>
        <Grid>
          <Input
            value={percentile}
            size="small"
            onChange={(e) => {
              setPercentile(
                e.target.value === ""
                  ? 0
                  : Number(e.target.value)
              );
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
              min: 0,
              max: 100,
              type: "number",
            }}
          />
        </Grid>
      </Grid>
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
        <StatItem {...percentileItem} />
      </Stack>
    </Box>
  );
};
