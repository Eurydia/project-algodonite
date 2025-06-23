import { useTheme } from "@mui/material";
import { BoxPlotChart } from "@sgratzl/chartjs-chart-boxplot";
import { max, min } from "d3-array";
import { memo, useEffect, useRef, type FC } from "react";

type BoxPlotProps = {
  data?: {
    q1: number;
    median: number;
    q3: number;
    whiskerMin: number;
    whiskerMax: number;
    items: number[];
  };
};
export const BoxPlot: FC<BoxPlotProps> = memo(
  ({ data }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<BoxPlotChart | null>(null);
    const {
      palette: { primary, secondary },
    } = useTheme();

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
              backgroundColor: primary.light,
              borderColor: primary.dark,
              borderWidth: 3,
              itemStyle: "circle",
              itemRadius: 10,
              outlierStyle: "circle",
              outlierBackgroundColor: secondary.light,
              outlierRadius: 10,
              outlierBorderWidth: 0,
              data: [
                data === undefined
                  ? undefined
                  : {
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
          scales:
            data === undefined
              ? undefined
              : {
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
    }, [
      data,
      primary.dark,
      primary.light,
      secondary.dark,
      secondary.light,
    ]);

    return <canvas ref={canvasRef} />;
  }
);
