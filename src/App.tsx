import {
  Box,
  CssBaseline,
  Paper,
  Stack,
  ThemeProvider,
} from "@mui/material";
import { useState, type FC } from "react";
import { CentralStatsDisplay } from "./components/CentralStatsDisplay";
import { DatasetForm } from "./components/DatasetForm";
import { DispersionStatsDisplay } from "./components/DispersionStatsDisplay";
import { PositionStatsDisplay } from "./components/PositionStatsDisplay";
import { theme } from "./theme";

export const App: FC = () => {
  const [data, setData] = useState<number[]>([]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        maxWidth="md"
        sx={{
          marginX: "auto",
          paddingY: 4,
          display: "flex",
          gap: 1,
          flexDirection: "column",
        }}
      >
        <Paper
          variant="outlined"
          sx={{ padding: 1 }}
        >
          <Stack spacing={2}>
            <DatasetForm
              initValue={data}
              onSubmit={setData}
            />
          </Stack>
        </Paper>
        <Paper
          variant="outlined"
          sx={{ padding: 1 }}
        >
          <CentralStatsDisplay data={data} />
        </Paper>
        <Paper
          variant="outlined"
          sx={{ padding: 1 }}
        >
          <DispersionStatsDisplay data={data} />
        </Paper>
        <Paper
          variant="outlined"
          sx={{ padding: 1 }}
        >
          <PositionStatsDisplay data={data} />
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

