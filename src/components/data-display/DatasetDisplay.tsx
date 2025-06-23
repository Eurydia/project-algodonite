import { useFormatNumber } from "@/hooks/useFormatNumber";
import {
  Alert,
  AlertTitle,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { memo, useMemo, type FC } from "react";
import { MathBlock } from "./MathBlock";

type Props = {
  dataset: number[];
  hasInvalid: boolean;
  datasetFromPopulation: boolean;
};
export const DatasetSourceDisplay: FC<Props> = memo(
  ({ dataset, datasetFromPopulation, hasInvalid }) => {
    const fmt = useFormatNumber();
    const sizeMsg = useMemo(() => {
      const size = fmt(dataset.length);
      return datasetFromPopulation
        ? `(N=${size})`
        : `(n=${size})`;
    }, [dataset.length, datasetFromPopulation, fmt]);

    const parsedDataset = useMemo(() => {
      return dataset.map((tok) => fmt(tok));
    }, [dataset, fmt]);

    return (
      <Stack spacing={1}>
        <MathBlock
          expr={`ข้อมูลที่จะถูกใช้ $${sizeMsg}$`}
        />
        <Paper
          variant="outlined"
          sx={{
            padding: 2,
          }}
        >
          {parsedDataset.length === 0 ? (
            <Typography>{`ไม่มีข้อมูล`}</Typography>
          ) : (
            <Typography
              sx={{
                wordBreak: "break-all",
                wordWrap: "break-word",
                whiteSpace: "wrap",
              }}
            >
              {parsedDataset.join(", ")}
            </Typography>
          )}
        </Paper>
        {hasInvalid && (
          <Alert severity="warning">
            <AlertTitle>{`คำเตือน`}</AlertTitle>
            <Typography>{`ข้อมูลบางส่วนไม่ถูกต้อง`}</Typography>
          </Alert>
        )}
      </Stack>
    );
  }
);
