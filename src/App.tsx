import {
  CssBaseline,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
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
      <Grid
        spacing={1}
        container
        sx={{ padding: 2 }}
      >
        <Grid
          size={{ xs: 12, md: 4 }}
          sx={{
            position: { md: "sticky", xs: "static" },
            top: 0,
          }}
        >
          <Paper
            variant="outlined"
            sx={{
              padding: 1,
              position: { md: "sticky", xs: "static" },
              top: 0,
            }}
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
                isPopulation={dataOrigin === "population"}
              />
            </Stack>
          </Paper>
        </Grid>
        <Grid
          size={{ xs: 12, md: "grow" }}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
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
            <PositionStatsDisplay
              data={data}
              dataOrigin={dataOrigin}
            />
          </Paper>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};
