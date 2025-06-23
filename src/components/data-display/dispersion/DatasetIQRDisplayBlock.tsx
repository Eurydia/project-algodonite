import { useFormatNumber } from "@/hooks/useFormatNumber";
import { getQuantile } from "@/services/make-quantile-item.helper";
import { Stack, Typography } from "@mui/material";
import { MathJax } from "better-react-mathjax";
import { Fragment, memo, useMemo, type FC } from "react";
import { CollapsibleCard } from "../../surface/CollapsibleCard";
import { StackedEquationItem } from "../StackedEquationItem";

type Props = {
  dataset: number[];
};
export const DatasetIQRDisplayBlock: FC<Props> = memo(
  ({ dataset }) => {
    const fmt = useFormatNumber();
    const { value, msg, q1, q3 } = useMemo(() => {
      if (dataset.length < 2) {
        return { value: undefined, msg: "$-$" };
      }
      const orderedDataset = [...dataset].sort(
        (a, b) => a - b
      );
      const q1 = getQuantile(orderedDataset, 1);
      const q3 = getQuantile(orderedDataset, 3);
      if (q1 === undefined || q3 === undefined) {
        return { value: undefined, msg: "$-$" };
      }
      const value = q3.value - q1.value;
      return {
        value,
        msg: `$${fmt(value)}$`,
        q1: q1.value,
        q3: q3.value,
      };
    }, [dataset, fmt]);

    const calcSteps = useMemo(() => {
      if (value === undefined) {
        return [];
      }
      const q1Fmt = fmt(q1, true);
      const q3Fmt = fmt(q3, true);
      return [
        `${q3Fmt} - ${q1Fmt}`,
        `\\boxed{${fmt(value)}}`,
      ];
    }, [fmt, q1, q3, value]);

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
              {`พิสัยระหว่างควอร์ไทล์:`}
            </Typography>
            <MathJax dynamic>{msg}</MathJax>
          </Typography>
        }
        slotContent={
          <Stack spacing={0.5}>
            <MathJax dynamic>
              {`สูตร: $$Q_{3} - Q_{1}$$`}
            </MathJax>
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
