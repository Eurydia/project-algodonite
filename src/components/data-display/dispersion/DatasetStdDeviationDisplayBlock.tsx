import { useFormatNumber } from "@/hooks/useFormatNumber";
import { Stack, Typography } from "@mui/material";
import { MathJax } from "better-react-mathjax";
import { mean, sum } from "d3-array";
import { Fragment, memo, useMemo, type FC } from "react";
import { CollapsibleCard } from "../../surface/CollapsibleCard";
import { StackedEquationItem } from "../StackedEquationItem";

type Props = {
  dataset: number[];
  fromPopulation: boolean;
};
export const DatasetStdDeviationDisplayBlock: FC<Props> =
  memo(({ dataset, fromPopulation }) => {
    const fmt = useFormatNumber();
    const { value, msg } = useMemo(() => {
      const dtMean = mean(dataset);
      if (dtMean === undefined) {
        return { value: undefined, msg: "$-$" };
      }

      const size = fromPopulation
        ? dataset.length
        : dataset.length - 1;

      if (size === 0) {
        return { value: undefined, msg: "$-$" };
      }
      let dtSumSqaureDiff = 0;
      for (const dt of dataset) {
        const diff = dt - dtMean;
        dtSumSqaureDiff += diff * diff;
      }
      const value = Math.sqrt(dtSumSqaureDiff / size);

      return { value, msg: `$${fmt(value)}$` };
    }, [dataset, fmt, fromPopulation]);

    const calcSteps = useMemo(() => {
      if (value === undefined) {
        return [];
      }
      const dtMean = mean(dataset)!;
      const size = dataset.length;

      const dtDiff = dataset.map((dt) => dt - dtMean);
      const dtDiffSquare = dtDiff.map((dt) => dt * dt);
      const dtDiffSquareSum = sum(dtDiffSquare);
      const dtMeanFmt = fmt(dtMean, true);

      const dtFmt = dataset
        .map(
          (dt) =>
            `\\left(${fmt(
              dt,
              true
            )} - ${dtMeanFmt}\\right)^{2}`
        )
        .join("+");
      const dtDiffFmt = dtDiff
        .map((dt) => `${fmt(dt, true)}^{2}`)
        .join("+");
      const dtDiffSquareFmt = dtDiffSquare
        .map((dt) => fmt(dt))
        .join("+");
      const dtDiffSquareSumFmt = fmt(dtDiffSquareSum);

      const sizeFmt = fmt(size);

      const step1 = fromPopulation
        ? `\\sqrt{\\frac{1}{${sizeFmt}} \\left( ${dtFmt} \\right) }`
        : `\\sqrt{\\frac{1}{${sizeFmt} - 1} \\left ( ${dtFmt} \\right) }`;

      const sizeEq = fromPopulation ? size : size - 1;
      const sizeEqFmt = fmt(sizeEq);

      const divRes = dtDiffSquareSum / sizeEq;
      const divResFmt = fmt(divRes);
      const step2 = `\\sqrt{\\frac{1}{${sizeEqFmt}} \\left( ${dtDiffFmt} \\right) }`;
      const step3 = `\\sqrt{\\frac{1}{${sizeEqFmt}} \\left( ${dtDiffSquareFmt} \\right) }`;
      const step4 = `\\sqrt{\\frac{1}{${sizeEqFmt}} \\left( ${dtDiffSquareSumFmt} \\right) }`;
      const step5 = `\\sqrt{ ${divResFmt} }`;
      return [
        step1,
        step2,
        step3,
        step4,
        step5,
        `\\boxed{${fmt(value)}}`,
      ];
    }, [dataset, fmt, fromPopulation, value]);

    const formulaMsg = useMemo(() => {
      return fromPopulation
        ? `\\sigma = \\sqrt{\\frac{1}{N} \\sum_{i=1}^{N} (x_{i} - \\mu)^{2} }`
        : `s = \\sqrt{\\frac{1}{n-1} \\sum_{i=1}^{n} (x_{i} - \\overline{x})^{2} }`;
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
              {`ส่วนเบี่ยงเบนมาตรฐาน:`}
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
  });
