import { Paper, Stack, Typography } from "@mui/material";
import { memo, type FC } from "react";
import { DatasetCoeffVarDisplayBlock } from "../data-display/dispersion/DatasetCoeffVarDisplayBlock copy";
import { DatasetIQRDisplayBlock } from "../data-display/dispersion/DatasetIQRDisplayBlock";
import { DatasetRangeDisplayBlock } from "../data-display/dispersion/DatasetRangeDisplayBlock";
import { DatasetStdDeviationDisplayBlock } from "../data-display/dispersion/DatasetStdDeviationDisplayBlock";
import { DatasetVarianceDisplayBlock } from "../data-display/dispersion/DatasetVarianceDisplayBlock";

type Props = {
  dataset: number[];
  fromPopulation: boolean;
};
export const DispersionCard: FC<Props> = memo(
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
            {`ค่าวัดการกระจาย`}
          </Typography>
          <DatasetRangeDisplayBlock dataset={dataset} />
          <DatasetIQRDisplayBlock dataset={dataset} />
          <DatasetStdDeviationDisplayBlock
            dataset={dataset}
            fromPopulation={fromPopulation}
          />
          <DatasetVarianceDisplayBlock
            dataset={dataset}
            fromPopulation={fromPopulation}
          />
          <DatasetCoeffVarDisplayBlock
            dataset={dataset}
            fromPopulation={fromPopulation}
          />
        </Stack>
      </Paper>
    );
  }
);
