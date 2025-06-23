import { useFormatNumber } from "@/hooks/useFormatNumber";
import { Stack, Typography } from "@mui/material";
import { MathJax } from "better-react-mathjax";
import { mean } from "d3-array";
import { memo, useMemo, type FC } from "react";
import { CollapsibleCard } from "../../surface/CollapsibleCard";

type Props = {
  dataset: number[];
  fromPopulation: boolean;
};
export const DatasetVarianceDisplayBlock: FC<Props> = memo(
  ({ dataset, fromPopulation }) => {
    const fmt = useFormatNumber();
    const { msg } = useMemo(() => {
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
      const value = dtSumSqaureDiff / size;

      return { msg: `$${fmt(value)}$` };
    }, [dataset, fmt, fromPopulation]);

    const formulaMsg = useMemo(() => {
      return fromPopulation
        ? `\\sigma^{2} = \\frac{1}{N} \\sum_{i=1}^{N} (x_{i} - \\mu)^{2}`
        : `s^{2} = \\frac{1}{n-1} \\sum_{i=1}^{n} (x_{i} - \\overline{x})^{2}`;
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
              {`ค่าความแปรปรวน:`}
            </Typography>
            <MathJax dynamic>{msg}</MathJax>
          </Typography>
        }
        slotContent={
          <Stack spacing={0.5}>
            <MathJax dynamic>
              {`สูตร: $$${formulaMsg}$$`}
            </MathJax>
          </Stack>
        }
      />
    );
  }
);
