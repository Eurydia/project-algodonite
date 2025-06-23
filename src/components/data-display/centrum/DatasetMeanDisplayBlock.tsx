import { useFormatNumber } from "@/hooks/useFormatNumber";
import { Stack, Typography } from "@mui/material";
import { MathJax } from "better-react-mathjax";
import { mean, sum } from "d3-array";
import { Fragment, memo, useMemo, type FC } from "react";
import { CollapsibleCard } from "../../surface/CollapsibleCard";
import { StackedEquationItem } from "../StackedEquationItem";

type Props = {
  fromPopulation: boolean;
  dataset: number[];
};

export const DatasetMeanDisplayBlock: FC<Props> = memo(
  ({ dataset, fromPopulation }) => {
    const fmt = useFormatNumber();

    const result = useMemo(() => {
      let msg = "$-$";
      const value = mean(dataset);
      if (value !== undefined) {
        msg = fromPopulation
          ? `$\\mu=${fmt(value)}$`
          : `$\\overline{x}=${fmt(value)}$`;
      }
      return {
        value,
        msg,
      };
    }, [dataset, fmt, fromPopulation]);

    const formulaBaseMsg = useMemo(() => {
      return !fromPopulation
        ? `\\overline{x}=\\frac{1}{n}\\sum_{i=1}^{n} x_{i}`
        : `\\mu=\\frac{1}{N}\\sum_{i=1}^{N} x_{i}`;
    }, [fromPopulation]);

    const calcSteps = useMemo(() => {
      if (result.value === undefined) {
        return [];
      }
      const datasetExpandedSum = dataset
        .map((dt) =>
          dt < 0 ? `\\left(${fmt(dt)}\\right)` : fmt(dt)
        )
        .join("+");

      const datasetSize = fmt(dataset.length);
      const datasetSum = fmt(sum(dataset));
      return [
        `\\frac{1}{${datasetSize}}\\left(${datasetExpandedSum}\\right)`,
        `\\frac{1}{${datasetSize}}\\left(${datasetSum}\\right)`,
        `\\boxed{${fmt(result.value)}}`,
      ];
    }, [dataset, fmt, result]);

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
              {`ค่าเฉลี่ย:`}
            </Typography>
            <MathJax dynamic>{result.msg}</MathJax>
          </Typography>
        }
        slotContent={
          <Stack spacing={0.5}>
            <MathJax dynamic>
              {`สูตร:  $$${formulaBaseMsg}$$`}
            </MathJax>
            {result.value !== undefined && (
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
