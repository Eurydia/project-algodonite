import {
  Button,
  Stack,
  TextField,
  Toolbar,
} from "@mui/material";
import { useState, type FC } from "react";
import { MathBlock } from "./MathBlock";

type Props = {
  initValue: number[];
  onSubmit: (value: number[]) => unknown;
  originMode: "population" | "sample";
};
export const DatasetForm: FC<Props> = ({
  initValue,
  onSubmit,
  originMode,
}) => {
  const [rawInput, setRawInput] = useState(
    initValue.join(", ")
  );

  const parsed = rawInput
    .split(",")
    .filter(Boolean)
    .map((token) => {
      try {
        return Number(token);
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
      <MathBlock
        expr={`ข้อมูลที่จะถูกใช้ 
          $(${originMode === "population" ? "N" : "n"}=${
          parsed.length
        })$
          :
          ${
            parsed.length > 0
              ? `$${parsed
                  .map(
                    (tok) =>
                      `\\underline{${tok.toLocaleString(
                        "fullwide",
                        { useGrouping: false }
                      )}}`
                  )
                  .join(", ")}$`
              : `ว่าง`
          }`}
      />
    </Stack>
  );
};
