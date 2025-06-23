import { useFormatNumber } from "@/hooks/useFormatNumber";
import { getPercentile } from "@/services/make-quantile-item.helper";
import {
  Grid,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import { MathJax } from "better-react-mathjax";
import {
  Fragment,
  memo,
  useCallback,
  useMemo,
  useState,
  type FC,
} from "react";
import { CollapsibleCard } from "../../surface/CollapsibleCard";
import { StackedEquationItem } from "../StackedEquationItem";

type Props = {
  orderedDataset: number[];
  fromPopulation: boolean;
};
export const DatasetPercentileDisplayBlock: FC<Props> =
  memo(({ fromPopulation, orderedDataset }) => {
    const fmt = useFormatNumber();
    const [p, setP] = useState(1);

    const { value, msg, decimal, left, right } =
      useMemo(() => {
        const pValue = getPercentile(orderedDataset, p);
        if (pValue === undefined) {
          return { value: undefined, msg: "$-$" };
        }

        return {
          msg: `$${fmt(pValue.value)}$`,
          decimal: pValue.decimal,
          value: pValue.value,
          left: pValue.posLeft,
          right: pValue.posRight,
        };
      }, [fmt, orderedDataset, p]);

    const posCalcSteps = useMemo(() => {
      if (value === undefined) {
        return [];
      }
      const size = orderedDataset.length;
      const sizeFmt = fmt(size);
      const step1 = `\\frac{1}{4}(${sizeFmt} + 1)`;
      const step2 = `\\frac{1}{4}(${fmt(size + 1)})`;
      const step3 = fmt((size + 1) / 4);
      return [step1, step2, step3];
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
        ? `P_{${p}} = \\frac{${p}}{100}(N + 1)`
        : `P_{${p}} = \\frac{${p}}{100}(n + 1)`;
    }, [fromPopulation, p]);

    const handleSliderChange = useCallback(
      (_: unknown, v: number) => {
        setP(v);
      },
      []
    );

    return (
      <CollapsibleCard
        slotTitle={
          <Grid
            container
            spacing={1}
            sx={{ flexGrow: 1, flexBasis: 0 }}
          >
            <Grid size={12}>
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
                  {`เปอร์เซ็นไทล์ ${p}:`}
                </Typography>
                <MathJax dynamic>{msg}</MathJax>
              </Typography>
            </Grid>
            <Grid size={8}>
              <Slider
                max={99}
                min={1}
                value={p}
                onChange={handleSliderChange}
              />
            </Grid>
          </Grid>
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
  });
