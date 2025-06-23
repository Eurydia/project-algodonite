import { useFormatNumber } from "@/hooks/useFormatNumber";
import { Stack, Typography } from "@mui/material";
import { MathJax } from "better-react-mathjax";
import { median } from "d3-array";
import { Fragment, memo, useMemo, type FC } from "react";
import { CollapsibleCard } from "../../surface/CollapsibleCard";
import { StackedEquationItem } from "../StackedEquationItem";

type Props = {
  dataset: number[];
};

export const DatasetMedianDisplayBlock: FC<Props> = memo(
  ({ dataset }) => {
    const fmt = useFormatNumber();

    const { value, msg } = useMemo(() => {
      let msg = "$-$";
      const value = median(dataset);
      if (value !== undefined) {
        msg = `$${fmt(value)}$`;
      }
      return {
        value,
        msg,
      };
    }, [dataset, fmt]);

    const calcSteps = useMemo(() => {
      if (value === undefined) {
        return [];
      }
      const mid = (dataset.length + 1) / 2 - 1;
      const left = Math.floor(mid);
      const right = Math.ceil(mid);

      const centerPoints = new Set([left, right]);
      const orderedDataset = [...dataset].sort(
        (a, b) => a - b
      );

      const orderedDatasetExpanded = orderedDataset
        .map((dt, index) =>
          centerPoints.has(index)
            ? `\\underline{${fmt(dt)}}`
            : fmt(dt)
        )
        .join(",");

      if (centerPoints.size === 1) {
        return [
          orderedDatasetExpanded,
          `\\boxed{${fmt(value)}}`,
        ];
      }
      const vLeft = orderedDataset[left];
      const vRight = orderedDataset[right];

      const vLeftFmt = fmt(vLeft, true);
      const vRightFmt = fmt(vRight, true);
      const midSum = vLeft + vRight;
      const midSumFmt = fmt(midSum, true);
      return [
        orderedDatasetExpanded,
        `\\frac{${vLeftFmt} + ${vRightFmt}}{2}`,
        `\\frac{${midSumFmt}}{2}`,
        `\\boxed{${fmt(value)}}`,
      ];
    }, [dataset, fmt, value]);

    return (
      <CollapsibleCard
        slotTitle={
          <Typography
            component="div"
            sx={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 1,
              alignItems: "baseline",
            }}
          >
            <Typography fontWeight={700}>
              {`มัธยฐาน:`}
            </Typography>
            <MathJax dynamic>{msg}</MathJax>
          </Typography>
        }
        slotContent={
          <Stack spacing={0.5}>
            {value !== undefined && (
              <Fragment>
                <Typography>{`ขั้นตอนการคำนวณ:`}</Typography>
                {calcSteps.map((msg, index) => (
                  <StackedEquationItem
                    latex={`$$${msg}$$`}
                    key={`step-${index}`}
                    isLast={index === calcSteps.length - 1}
                  />
                ))}
              </Fragment>
            )}
          </Stack>
        }
      />
    );
  }
);
