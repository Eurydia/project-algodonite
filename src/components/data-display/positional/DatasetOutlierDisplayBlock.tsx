import { useFormatNumber } from "@/hooks/useFormatNumber";
import { getQuantile } from "@/services/make-quantile-item.helper";
import { Paper, Typography } from "@mui/material";
import { MathJax } from "better-react-mathjax";
import { memo, useMemo, type FC } from "react";

type Props = {
  orderedDataset: number[];
};
export const DatasetOutlierDisplayBlock: FC<Props> = memo(
  ({ orderedDataset }) => {
    const fmt = useFormatNumber();

    const { msg } = useMemo(() => {
      const q1 = getQuantile(orderedDataset, 1);
      const q3 = getQuantile(orderedDataset, 3);
      if (q3 === undefined || q1 === undefined) {
        return { msg: "$-$" };
      }
      const vMin = q1.value - 1.5 * (q3.value - q1.value);
      const vMax = q3.value + 1.5 * (q3.value - q1.value);

      const v = orderedDataset
        .filter((dt) => dt < vMin || dt > vMax)
        .map((v) => fmt(v));
      return {
        msg:
          v.length === 0
            ? "ไม่พบค่านอกเกณฑ์"
            : `$${v.join(",")}$`,
      };
    }, [fmt, orderedDataset]);

    return (
      <Paper
        variant="outlined"
        sx={{ padding: 2 }}
      >
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
            {`ค่านอกเกณฑ์:`}
          </Typography>
          <MathJax dynamic>{`${msg}`}</MathJax>
        </Typography>
      </Paper>
    );
  }
);
