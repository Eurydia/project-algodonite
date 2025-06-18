import {
  Box,
  CssBaseline,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
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
  const [dataOrigin, setDataOrigin] = useState<
    "sample" | "population"
  >("population");

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
          <Stack spacing={1}>
            <FormControl>
              <FormLabel>{`แหล่งที่มาของข้อมูล`}</FormLabel>
              <RadioGroup
                row
                value={dataOrigin}
                onChange={(e) =>
                  setDataOrigin(
                    e.target.value as typeof dataOrigin
                  )
                }
              >
                <FormControlLabel
                  value="population"
                  control={<Radio />}
                  label="ประชากร"
                />
                <FormControlLabel
                  value="sample"
                  control={<Radio />}
                  label="กลุ่มตัวอย่าง"
                />
              </RadioGroup>
            </FormControl>
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
          <CentralStatsDisplay
            dataOrigin={dataOrigin}
            data={data}
          />
        </Paper>
        <Paper
          variant="outlined"
          sx={{ padding: 1 }}
          component="div"
        >
          <DispersionStatsDisplay
            dataOrigin={dataOrigin}
            data={data}
          />
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

