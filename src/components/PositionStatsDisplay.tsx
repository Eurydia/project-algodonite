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
import { blue, deepOrange } from "@mui/material/colors";
import { BoxPlotChart } from "@sgratzl/chartjs-chart-boxplot";
import { max, min } from "d3-array";
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FC,
} from "react";
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
  data: {
    q1: number;
    median: number;
    q3: number;
    whiskerMin: number;
    whiskerMax: number;
    items: number[];
  };
};
const BoxPlotBlock: FC<BoxPlotBlockProps> = memo(
  ({ data }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<BoxPlotChart | null>(null);

    useEffect(() => {
      if (canvasRef.current === null) {
        return;
      }
      const ctx = canvasRef.current.getContext("2d");
      if (ctx === null) {
        return;
      }
      if (chartRef.current !== null) {
        chartRef.current.destroy();
      }
      chartRef.current = new BoxPlotChart(ctx, {
        data: {
          labels: [""],
          datasets: [
            {
              backgroundColor: blue.A100,
              borderColor: blue.A700,
              borderWidth: 3,
              itemStyle: "circle",
              itemRadius: 10,
              outlierStyle: "circle",
              outlierBackgroundColor: deepOrange.A100,
              outlierBorderColor: deepOrange.A700,
              outlierBorderWidth: 3,
              outlierRadius: 10,
              data: [
                {
                  whiskerMax: data.whiskerMax,
                  whiskerMin: data.whiskerMin,
                  q1: data.q1,
                  q3: data.q3,
                  median: data.median,
                  items: data.items.filter(
                    (v) =>
                      v >= data.whiskerMin &&
                      v <= data.whiskerMax
                  ),
                  outliers: data.items.filter(
                    (v) =>
                      v < data.whiskerMin ||
                      v > data.whiskerMax
                  ),
                },
              ],
            },
          ],
        },
        options: {
          indexAxis: "y",
          responsive: true,
          scales: {
            x: {
              type: "linear",
              suggestedMin: Math.min(
                data.whiskerMin,
                min(data.items)!
              ),
              suggestedMax: Math.max(
                data.whiskerMax,
                max(data.items)!
              ),
              grace: "5%",
              beginAtZero: false,
            },
          },
        },
      }) as unknown as BoxPlotChart;
      return () => chartRef.current?.destroy();
    }, [data]);

    return <canvas ref={canvasRef} />;
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
      const q1 = makeQuantileItem(
        dataSorted,
        1,
        isPopulation
      );
      const q2 = makeQuantileItem(
        dataSorted,
        2,
        isPopulation
      );
      const q3 = makeQuantileItem(
        dataSorted,
        3,
        isPopulation
      );

      let boxMin: number | undefined;
      let boxMax: number | undefined;
      if (
        q1.value !== undefined &&
        q3.value !== undefined
      ) {
        boxMin = q1.value - 1.5 * (q3.value - q1.value);
        boxMax = q3.value + 1.5 * (q3.value - q1.value);
      }
      let outliers: string | undefined;
      if (boxMin !== undefined && boxMax !== undefined) {
        const outliersValues = dataSorted.filter(
          (v) => v > boxMax || v < boxMin
        );
        outliers =
          outliersValues.length > 0
            ? outliersValues
                .map((v) => v.toLocaleString("fullwide"))
                .join(",")
            : "-";
      }

      return [
        q1,
        q2,
        q3,
        {
          label: `ค่าต่ำสุด`,
          value: boxMin,
          expr: `m &= Q_{1} - 1.5 \\cdot (Q_{3} - Q_{1})`,
        },
        {
          label: `ค่าสูงสุด`,
          value: boxMax,
          expr: `M &= Q_{3} + 1.5 \\cdot (Q_{3} - Q_{1})`,
        },
        {
          label: `ค่านอกเกณฑ์`,
          value: outliers,
        },
      ];
    }, [dataSorted, isPopulation]);

    const percentileStat = useMemo(() => {
      return makePercentileItem(
        dataSorted,
        percentile,
        isPopulation
      );
    }, [dataSorted, percentile, isPopulation]);

    const plotData = useMemo(() => {
      if (dataSorted.length === 0) {
        return undefined;
      }

      const [q1, q2, q3, wMin, wMax] = stat;
      if (
        q1.value === undefined ||
        q2.value === undefined ||
        q3.value === undefined ||
        wMin === undefined ||
        wMax === undefined
      ) {
        return undefined;
      }

      return {
        q1: q1.value as number,
        median: q2.value as number,
        q3: q3.value as number,
        whiskerMax: wMax.value as number,
        whiskerMin: wMin.value as number,
        items: dataSorted,
      };
    }, [dataSorted, stat]);

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
          <PercentileBlock
            value={percentile}
            onChange={setPercentile}
            item={percentileStat}
          />
        </Stack>
        {plotData !== undefined && (
          <BoxPlotBlock data={plotData} />
        )}
      </Box>
    );
  }
);
