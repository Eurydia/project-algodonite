import { Paper, Stack } from "@mui/material";
import { useState, type FC } from "react";
import { CentrumCard } from "./components/card/CentrumCard";
import { DispersionCard } from "./components/card/DispersionCard";
import { PositionalCard } from "./components/card/PositionalCard";
import { DatasetInputForm } from "./components/forms/DatasetInputForm";
import { SplitPanelLayout } from "./layouts/SplitPanelLayout";

export const App: FC = () => {
  const [data, setData] = useState<{
    fromPopulation: boolean;
    dataset: number[];
  }>({ fromPopulation: true, dataset: [] });

  return (
    <SplitPanelLayout
      left={
        <Paper
          elevation={4}
          sx={{
            backgroundColor: "background.paper",
            padding: 2,
            maxHeight: { md: "100%" },
            overflowY: "auto",
            scrollbarWidth: "thin",
          }}
        >
          <DatasetInputForm onSubmit={setData} />
        </Paper>
      }
      right={
        <Stack spacing={2}>
          <CentrumCard {...data} />
          <DispersionCard {...data} />
          <PositionalCard {...data} />
        </Stack>
      }
    />
  );
};
