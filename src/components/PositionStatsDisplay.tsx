import {
  makePercentileItem,
  makeQuantileItem,
} from "@/services/make-quantile-item.helper";
import { niceScale } from "@/services/range-maker.helper";
import {
  Box,
  Grid,
  Input,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import {
  memo,
  useCallback,
  useMemo,
  useState,
  type ChangeEvent,
  type FC,
} from "react";
import {
  VictoryAxis,
  VictoryBoxPlot,
  VictoryChart,
  VictoryGroup,
  VictoryLabel,
  VictoryLine,
} from "victory";
import { StatItem } from "./StatItem";

type PercentileBlockProps = {
  value: number;
  onChange: (v: number) => unknown;
  item: {
    label: string;
    value?: number;
    expr?: string;
    exprExt?: string;
  };
};
const PercentileBlock: FC<PercentileBlockProps> = memo(
  ({ value, onChange, item }) => {
    const handleSliderChange = useCallback(
      (_: unknown, v: number) => {
        onChange(v);
      },
      [onChange]
    );
    const handleInputChange = useCallback(
      (
        e: ChangeEvent<
          HTMLTextAreaElement | HTMLInputElement
        >
      ) => {
        const v =
          e.target.value === ""
            ? 0
            : Number(e.target.value);
        onChange(Math.max(Math.min(99, v), 1));
      },
      [onChange]
    );

    const handleBlur = useCallback(() => {
      if (value < 1) {
        onChange(1);
      } else if (value > 99) {
        onChange(99);
      }
    }, [onChange, value]);

    return (
      <Stack>
        <Typography gutterBottom>เปอร์เซ็นไทล์</Typography>
        <Box>
          <Grid
            container
            spacing={2}
          >
            <Grid size="grow">
              <Slider
                max={99}
                min={1}
                value={value}
                onChange={handleSliderChange}
              />
            </Grid>
            <Grid size={2}>
              <Input
                value={value}
                size="small"
                onChange={handleInputChange}
                onBlur={handleBlur}
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
        <StatItem {...item} />
      </Stack>
    );
  }
);

type BoxPlotBlockProps = {
  percentile: number;
  q1: number;
  q2: number;
  q3: number;
  vMin: number;
  vMax: number;
};
const BoxPlotBlock: FC<BoxPlotBlockProps> = memo(
  ({ q1, q2, q3, vMax, vMin, percentile }) => {
    return (
      <VictoryChart
        height={200}
        horizontal
        domain={{
          y: niceScale(vMin, vMax, 8),
          x: [0, 0.5],
        }}
      >
        <VictoryAxis tickValues={[]} />
        <VictoryAxis dependentAxis />
        <VictoryGroup>
          <VictoryBoxPlot
            labels
            labelOrientation="top"
            min={"min"}
            q1={"q1"}
            q3="q3"
            max="max"
            median={"mean"}
            data={[
              {
                x: 0.25,
                q1,
                mean: q2,
                q3,
                max: vMax,
                min: vMin,
              },
            ]}
          />
          <VictoryLine
            data={[
              { x: 0, y: percentile },
              { x: 0.25, y: percentile },
              { x: 0.5, y: percentile },
            ]}
            labels={({ datum }) => datum.label}
            labelComponent={
              <VictoryLabel
                dy={8}
                style={{ fontSize: 12, fill: "#ff4d4f" }}
              />
            }
          />
        </VictoryGroup>
      </VictoryChart>
    );
  }
);

type Props = {
  dataSorted: number[];
  isPopulation: boolean;
};
export const PositionStatsDisplay: FC<Props> = memo(
  ({ dataSorted, isPopulation }) => {
    const [percentile, setPercentile] = useState(50);

    const stat = useMemo(() => {
      return [
        makeQuantileItem(dataSorted, 1, isPopulation),
        makeQuantileItem(dataSorted, 2, isPopulation),
        makeQuantileItem(dataSorted, 3, isPopulation),
      ];
    }, [dataSorted, isPopulation]);

    const percentileStat = useMemo(() => {
      return makePercentileItem(
        dataSorted,
        percentile,
        isPopulation
      );
    }, [dataSorted, percentile, isPopulation]);

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
        </Stack>
        <PercentileBlock
          value={percentile}
          onChange={setPercentile}
          item={percentileStat}
        />
        {dataSorted.length > 0 &&
          percentileStat.value !== undefined && (
            <BoxPlotBlock
              q1={stat[0].value!}
              q2={stat[1].value!}
              q3={stat[2].value!}
              vMax={dataSorted[dataSorted.length - 1]}
              vMin={dataSorted[0]}
              percentile={percentileStat.value}
            />
          )}
      </Box>
    );
  }
);
