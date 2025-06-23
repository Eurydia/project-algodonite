import { useFormatNumber } from "@/hooks/useFormatNumber";
import { getQuantile } from "@/services/make-quantile-item.helper";
import { Stack, Typography } from "@mui/material";
import { MathJax } from "better-react-mathjax";
import { Fragment, memo, useMemo, type FC } from "react";
import { CollapsibleCard } from "../../surface/CollapsibleCard";
import { StackedEquationItem } from "../StackedEquationItem";

type Props = {
  orderedDataset: number[];
};
export const DatasetWhiskerMaxDisplayBlock: FC<Props> =
  memo(({ orderedDataset }) => {
    const fmt = useFormatNumber();

    const { value, msg, q1, q3 } = useMemo(() => {
      const q1 = getQuantile(orderedDataset, 1);
      const q3 = getQuantile(orderedDataset, 3);
      if (q3 === undefined || q1 === undefined) {
        return { value: undefined, msg: "-" };
      }
      const value = q3.value + 1.5 * (q3.value - q1.value);
      return {
        msg: fmt(value),
        value,
        q1: q1.value,
        q3: q3.value,
      };
    }, [fmt, orderedDataset]);

    const calcSteps = useMemo(() => {
      if (value === undefined) {
        return [];
      }
      const q1Fmt = fmt(q1, true);
      const q3Fmt = fmt(q3, true);

      const diff = q3 - q1;
      const diffFmt = fmt(diff);

      const mult = 1.5 * diff;
      const multFmt = fmt(mult, true);

      return [
        `${q3Fmt} + 1.5\\left (${q3Fmt} - ${q1Fmt} \\right)`,
        `${q3Fmt} + 1.5\\left (${diffFmt} \\right)`,
        `${q3Fmt} + ${multFmt}`,
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
            <MathJax dynamic>
              {`$\\symbf{Q_{3} + 1.5\\left (Q_{3} - Q_{1} \\right)}: ${msg}$`}
            </MathJax>
          </Typography>
        }
        slotContent={
          <Stack spacing={0.5}>
            {value !== undefined && (
              <Fragment>
                <Typography>{`คำนวณค่า:`}</Typography>
                {calcSteps.map((msg, index) => (
                  <StackedEquationItem
                    latex={`$$${msg}$$`}
                    key={`pos-step-${index}`}
                    isLast={index === calcSteps.length - 1}
                  />
                ))}
              </Fragment>
            )}
          </Stack>
        }
      />
    );
  });
