import { useFormatNumber } from "@/hooks/useFormatNumber";
import { getQuantile } from "@/services/make-quantile-item.helper";
import { Stack, Typography } from "@mui/material";
import { MathJax } from "better-react-mathjax";
import { Fragment, memo, useMemo, type FC } from "react";
import { CollapsibleCard } from "../../surface/CollapsibleCard";
import { StackedEquationItem } from "../StackedEquationItem";

type Props = {
  orderedDataset: number[];
  fromPopulation: boolean;
};
export const DatasetQ3DisplayBlock: FC<Props> = memo(
  ({ orderedDataset, fromPopulation }) => {
    const fmt = useFormatNumber();

    const { value, msg, decimal, left, right } =
      useMemo(() => {
        const q3 = getQuantile(orderedDataset, 3);
        if (q3 === undefined) {
          return { value: undefined, msg: "$-$" };
        }

        return {
          msg: `$${fmt(q3.value)}$`,
          decimal: q3.decimal,
          value: q3.value,
          left: q3.posLeft,
          right: q3.posRight,
        };
      }, [fmt, orderedDataset]);

    const posCalcSteps = useMemo(() => {
      if (value === undefined) {
        return [];
      }
      const size = orderedDataset.length;
      const sizeFmt = fmt(size);
      const step1 = `\\frac{3}{4}(${sizeFmt} + 1)`;
      const step2 = `\\frac{3}{4}(${fmt(size + 1)})`;
      const r3Size = 3 * (size + 1);
      const step3 = `\\frac{${fmt(r3Size)}}{4}`;
      const step4 = fmt(r3Size / 4);
      return [step1, step2, step3, step4];
    }, [fmt, orderedDataset.length, value]);

    const calcSteps = useMemo(() => {
      if (value === undefined) {
        return [];
      }
      const vLeft = orderedDataset[left];
      const vRight = orderedDataset[right];

      const vLeftFmt = fmt(vLeft, true);
      const vRightFmt = fmt(vRight, true);
      const decFmt = fmt(decimal, true);
      const step1 = `${vLeftFmt} + ${decFmt}\\left( ${vRightFmt} - ${vLeftFmt} \\right)`;

      const diff = vRight - vLeft;
      const diffFmt = fmt(diff);
      const step2 = `${vLeftFmt} + ${decFmt}\\left( ${diffFmt} \\right)`;

      const mul = diff * decimal;
      const multFmt = fmt(mul, true);
      const step3 = `${vLeftFmt} + ${multFmt}`;

      return [
        step1,
        step2,
        step3,
        `\\boxed{${fmt(value)}}`,
      ];
    }, [decimal, fmt, left, orderedDataset, right, value]);

    const formulaMsg = useMemo(() => {
      return fromPopulation
        ? `Q_{3} = \\frac{3}{4}(N + 1)`
        : `Q_{3} = \\frac{3}{4}(n + 1)`;
    }, [fromPopulation]);

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
              {`ควอร์ไทล์ที่ 3:`}
            </Typography>
            <MathJax dynamic>{msg}</MathJax>
          </Typography>
        }
        slotContent={
          <Stack spacing={0.5}>
            <MathJax dynamic>
              {`สูตร: $$${formulaMsg}$$`}
            </MathJax>
            {value !== undefined && (
              <Fragment>
                <Typography>{`หาตำแหน่ง:`}</Typography>
                {posCalcSteps.map((msg, index) => (
                  <StackedEquationItem
                    latex={`$$${msg}$$`}
                    key={`pos-step-${index}`}
                  />
                ))}

                <Typography>{`เรียงลำดับข้อมูล:`}</Typography>
                <StackedEquationItem
                  latex={`$$${orderedDataset
                    .map((dt, index) =>
                      index === left || index === right
                        ? `\\underline{${fmt(dt)}}`
                        : fmt(dt)
                    )
                    .join(",")}$$`}
                />
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
  }
);
