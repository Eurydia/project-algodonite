import { useFormatNumber } from "@/hooks/useFormatNumber";
import { Stack, Typography } from "@mui/material";
import { MathJax } from "better-react-mathjax";
import { mean } from "d3-array";
import { Fragment, memo, useMemo, type FC } from "react";
import { CollapsibleCard } from "../../surface/CollapsibleCard";
import { StackedEquationItem } from "../StackedEquationItem";

type Props = {
  dataset: number[];
  fromPopulation: boolean;
};
export const DatasetCoeffVarDisplayBlock: FC<Props> = memo(
  ({ dataset, fromPopulation }) => {
    const fmt = useFormatNumber();

    const formulaMsg = useMemo(() => {
      return !fromPopulation
        ? `\\frac{s}{|\\overline{x}|}`
        : `\\frac{\\sigma}{|\\mu|}`;
    }, [fromPopulation]);

    const { value, msg, dtStdDev, dtMean } = useMemo(() => {
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
      const dtStdDev = Math.sqrt(dtSumSqaureDiff / size);
      const value = dtStdDev / Math.abs(dtMean);

      return {
        value,
        msg: `$${fmt(value)}$`,
        dtStdDev,
        dtMean,
      };
    }, [dataset, fmt, fromPopulation]);

    const calcSteps = useMemo(() => {
      if (value === undefined) {
        return [];
      }

      const dtMeanAbsFmt = fmt(Math.abs(dtMean));
      const dtStdDevFmt = fmt(dtStdDev);
      const step1 = `\\frac{${dtStdDevFmt}}{|${dtMean}|}`;
      const step2 = `\\frac{${dtStdDevFmt}}{${dtMeanAbsFmt}}`;

      return [step1, step2, `\\boxed{${fmt(value)}}`];
    }, [dtMean, dtStdDev, fmt, value]);

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
              {`สัมประสิทธิ์ของการแปรผัน:`}
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
  }
);
