import {
  Button,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState, type FC } from "react";

type Props = {
  initValue: number[];
  onSubmit: (value: number[]) => unknown;
};
export const DatasetForm: FC<Props> = ({
  initValue,
  onSubmit,
}) => {
  const [rawInput, setRawInput] = useState(
    initValue.join(", ")
  );

  const parsed = rawInput
    .split(",")
    .map((token) => {
      try {
        return parseFloat(token);
      } catch {
        return null;
      }
    })
    .filter((value) => value !== null)
    .filter((value) => !isNaN(value));

  return (
    <Stack spacing={1}>
      <TextField
        placeholder="ป้อนข้อมูลแบ่งด้วย ',' เช่น 10, 20, 10, 30"
        multiline
        rows={6}
        value={rawInput}
        onChange={(e) => {
          setRawInput(e.target.value);
        }}
        slotProps={{
          input: {
            sx: { fontFamily: "monospace" },
            autoCapitalize: "off",
            autoComplete: "off",
            autoCorrect: "off",
            autoSave: "off",
          },
        }}
      />
      <Toolbar
        disableGutters
        variant="dense"
        sx={{ gap: 1, justifyContent: "space-between" }}
      >
        <Button
          variant="contained"
          disableElevation
          disableRipple
          onClick={() => {
            onSubmit(parsed);
          }}
        >
          คำนวณ
        </Button>
        <Button
          variant="outlined"
          disableElevation
          disableRipple
          onClick={() => setRawInput("")}
        >
          ลบทั้งหมด
        </Button>
      </Toolbar>
      <Typography>
        {`ข้อมูลที่จะถูกใช้: ${
          parsed.length > 0
            ? parsed
                .map((value) =>
                  value.toLocaleString("fullwide")
                )
                .join(", ")
            : `ว่าง`
        }`}
      </Typography>
    </Stack>
  );
};
