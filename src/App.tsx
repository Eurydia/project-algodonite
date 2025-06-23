import { Paper, Stack } from "@mui/material";
import { useState, type FC } from "react";
import { Attribution } from "./components/blogs/Attribution";
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
            scrollbarWidth: "none",
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
          <Paper
            variant="elevation"
            sx={{ padding: 2 }}
            elevation={4}
          >
            <Attribution />
          </Paper>
        </Stack>
      }
    />
  );
};
