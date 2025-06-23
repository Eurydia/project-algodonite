import { DatasetOriginInput } from "@/components/form-input/DatasetOriginInput";
import { Button, Stack, Toolbar } from "@mui/material";
import {
  memo,
  useCallback,
  useMemo,
  useState,
  type FC,
} from "react";
import { DatasetSourceDisplay } from "../data-display/DatasetDisplay";
import { DatasetSourceInput } from "../form-input/DatasetSourceInput";

type Props = {
  onSubmit: (value: {
    fromPopulation: boolean;
    dataset: number[];
  }) => unknown;
};
export const DatasetInputForm: FC<Props> = memo(
  ({ onSubmit }) => {
    const [datasetRaw, setDatasetRaw] = useState("");
    const [datasetOrigin, setDatasetOrigin] = useState("0");

    const handleClear = useCallback(() => {
      setDatasetRaw("");
    }, []);

    const { dataset, hasInvalid } = useMemo(() => {
      const dataset_: number[] = [];
      const tokens = datasetRaw.split(",");
      let hasInvalid_ = false;
      for (const token of tokens) {
        if (token.trim().length === 0) {
          continue;
        }
        const nToken = Number(token);
        if (isNaN(nToken) || !isFinite(nToken)) {
          hasInvalid_ = true;
          continue;
        }
        dataset_.push(nToken);
      }
      return { dataset: dataset_, hasInvalid: hasInvalid_ };
    }, [datasetRaw]);

    const handleSubmit = useCallback(
      () =>
        onSubmit({
          fromPopulation: datasetOrigin === "0",
          dataset,
        }),
      [dataset, datasetOrigin, onSubmit]
    );

    return (
      <Stack spacing={1}>
        <DatasetOriginInput
          value={datasetOrigin}
          onChange={setDatasetOrigin}
        />
        <DatasetSourceInput
          value={datasetRaw}
          onChange={setDatasetRaw}
        />
        <Toolbar
          disableGutters
          variant="dense"
          sx={{ gap: 1, justifyContent: "space-between" }}
        >
          <Button
            variant="contained"
            onClick={handleSubmit}
          >
            {`คำนวณ`}
          </Button>
          <Button
            variant="outlined"
            onClick={handleClear}
          >
            {`ลบทั้งหมด`}
          </Button>
        </Toolbar>
        <DatasetSourceDisplay
          dataset={dataset}
          hasInvalid={hasInvalid}
          datasetFromPopulation={datasetOrigin === "0"}
        />
      </Stack>
    );
  }
);
