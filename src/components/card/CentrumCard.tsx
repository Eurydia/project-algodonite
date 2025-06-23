import { Paper, Stack, Typography } from "@mui/material";
import { memo, type FC } from "react";
import { DatasetMeanDisplayBlock } from "../data-display/centrum/DatasetMeanDisplayBlock";
import { DatasetMedianDisplayBlock } from "../data-display/centrum/DatasetMedianDisplayBlock";
import { DatasetModeDisplayBlock } from "../data-display/centrum/DatasetModeDisplayBlock";

type Props = {
  fromPopulation: boolean;
  dataset: number[];
};
export const CentrumCard: FC<Props> = memo(
  ({ dataset, fromPopulation }) => {
    return (
      <Paper
        elevation={4}
        sx={{ padding: 2 }}
      >
        <Stack spacing={1}>
          <Typography
            component="div"
            variant="h5"
          >
            {`ค่ากลางของข้อมูล`}
          </Typography>
          <DatasetMeanDisplayBlock
            dataset={dataset}
            fromPopulation={fromPopulation}
          />
          <DatasetMedianDisplayBlock dataset={dataset} />
          <DatasetModeDisplayBlock dataset={dataset} />
        </Stack>
      </Paper>
    );
  }
);
