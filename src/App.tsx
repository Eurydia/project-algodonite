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
  Typography,
} from "@mui/material";
import { useCallback, useState, type FC } from "react";
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

  const handleDataChange = useCallback((dt: number[]) => {
    dt.sort((a, b) => a - b);
    setData([...dt]);
  }, []);

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
          <Stack
            spacing={1}
            sx={{
              position: { md: "sticky", xs: "static" },
              top: 0,
            }}
          >
            <Paper
              variant="outlined"
              sx={{
                padding: 1,
                height: "100%",
                justifyContent: "space-between",
              }}
            >
              <Stack
                component="div"
                spacing={1}
              >
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
                  onSubmit={handleDataChange}
                  isPopulation={dataOrigin === "population"}
                />
              </Stack>
            </Paper>
          </Stack>
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
              isPopulation={dataOrigin === "population"}
              dataSorted={data}
            />
          </Paper>
          <Paper
            variant="outlined"
            sx={{ padding: 1 }}
            component="div"
          >
            <DispersionStatsDisplay
              isPopulation={dataOrigin === "population"}
              data={data}
            />
          </Paper>
          <Paper
            variant="outlined"
            sx={{ padding: 1 }}
          >
            <PositionStatsDisplay
              dataSorted={data}
              isPopulation={dataOrigin === "population"}
            />
          </Paper>
          <Paper
            elevation={4}
            variant="elevation"
            sx={{
              padding: 1,
              // display: "flex",
              // alignItems: "center",
              // flexDirection: "column",
              color: theme.palette.getContrastText(
                theme.palette.primary.main
              ),
              backgroundColor: theme.palette.primary.main,
            }}
          >
            <Typography gutterBottom>
              {`เว็ปไซต์จัดทำให้เป็นสื่อการสอนหมวดคณิตศาสตร์
          โรงเรียนอยุธยาวิทยาลัย`}
            </Typography>
            <Typography fontWeight={700}>
              พัฒนาและปรับปรุงโดย
            </Typography>
            <Typography>
              {`คุณครูชุติมา ประภัสสรพิทยา และ`}
            </Typography>
            <Typography gutterBottom>
              {`นายธนกร พุทธรักษา`}
            </Typography>

            <Typography
              variant="subtitle2"
              component="div"
            >{`(แก้ไขครั้งล่าสุดเมื่อ: 19 มิถุนายน พ.ศ. 2568)`}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};
