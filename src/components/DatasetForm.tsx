import {
  Alert,
  Button,
  Paper,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  memo,
  useCallback,
  useMemo,
  useState,
  type FC,
} from "react";
import { MathBlock } from "./MathBlock";

type FeedbackBlockProps = {
  hasInvalid: boolean;
  parsedInput: number[];
  isPopulation: boolean;
};
const FeedbackBlock: FC<FeedbackBlockProps> = memo(
  ({ hasInvalid, isPopulation, parsedInput }) => {
    const sizeMsg = useMemo(() => {
      return isPopulation
        ? `$(N=${parsedInput.length}$)`
        : `$(n=${parsedInput.length}$)`;
    }, [parsedInput, isPopulation]);

    const feedbackMsg = useMemo(() => {
      return parsedInput.length > 0
        ? parsedInput
            .map((tok) =>
              tok.toLocaleString("fullwide", {
                useGrouping: false,
              })
            )
            .join(", ")
        : `ว่าง`;
    }, [parsedInput]);

    return (
      <Stack spacing={1}>
        <MathBlock expr={`ข้อมูลที่จะถูกใช้ ${sizeMsg}`} />
        <Paper
          variant="outlined"
          sx={{ padding: 2 }}
        >
          <Typography fontFamily="monospace">
            {feedbackMsg}
          </Typography>
        </Paper>
        {hasInvalid && (
          <Alert severity="warning">
            <Typography>ข้อมูลบางส่วนไม่ถูกต้อง</Typography>
          </Alert>
        )}
      </Stack>
    );
  }
);

type ToolbarBlockProps = {
  onClear: () => unknown;
  onSubmit: () => unknown;
};
const ToolbarBlock: FC<ToolbarBlockProps> = memo(
  ({ onClear, onSubmit }) => {
    return (
      <Toolbar
        disableGutters
        variant="dense"
        sx={{ gap: 1, justifyContent: "space-between" }}
      >
        <Button
          variant="contained"
          disableElevation
          disableRipple
          onClick={onSubmit}
        >
          คำนวณ
        </Button>
        <Button
          variant="outlined"
          disableElevation
          disableRipple
          onClick={onClear}
        >
          ลบทั้งหมด
        </Button>
      </Toolbar>
    );
  }
);

type Props = {
  initValue: number[];
  onSubmit: (value: number[]) => unknown;
  isPopulation: boolean;
};
export const DatasetForm: FC<Props> = memo(
  ({ initValue, onSubmit, isPopulation }) => {
    const [rawInput, setRawInput] = useState(
      initValue.join(", ")
    );
    const { parsed, hasInvalid } = useMemo(() => {
      const rawParsed = rawInput
        .split(",")
        .map((token) => token.trim())
        .filter((token) => token.length > 0)
        .map((token) => {
          try {
            return Number(token);
          } catch {
            return null;
          }
        });
      const rawLength = rawParsed.length;
      const parsed = rawParsed
        .filter((value) => value !== null)
        .filter((value) => !isNaN(value));
      return {
        parsed,
        hasInvalid: rawLength > parsed.length,
      };
    }, [rawInput]);

    const handleClear = useCallback(() => {
      setRawInput("");
    }, []);

    const handleSubmit = useCallback(
      () => onSubmit(parsed),
      [onSubmit, parsed]
    );

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
        <ToolbarBlock
          onClear={handleClear}
          onSubmit={handleSubmit}
        />
        <FeedbackBlock
          hasInvalid={hasInvalid}
          parsedInput={parsed}
          isPopulation={isPopulation}
        />
      </Stack>
    );
  }
);
