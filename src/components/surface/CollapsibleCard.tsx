import {
  Collapse,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  memo,
  useCallback,
  useState,
  type FC,
  type ReactNode,
} from "react";

type Props = {
  slotTitle: ReactNode;
  slotContent: ReactNode;
};
export const CollapsibleCard: FC<Props> = memo(
  ({ slotContent, slotTitle }) => {
    const [open, setOpen] = useState(false);
    const handleOpenToggle = useCallback(() => {
      setOpen((prev) => !prev);
    }, []);
    return (
      <Paper
        variant="outlined"
        sx={{ padding: 2 }}
      >
        <Stack
          flexDirection="row"
          flexWrap="wrap"
          spacing={0.5}
          useFlexGap
          justifyContent="space-between"
          alignItems="baseline"
        >
          {slotTitle}
          <Typography
            component="div"
            onClick={handleOpenToggle}
            sx={{
              "&:hover": {
                textDecorationLine: "underline",
              },
              "cursor": "pointer",
              "userSelect": "none",
            }}
          >
            {open ? "(ซ่อน)" : "(แสดง)"}
          </Typography>
        </Stack>
        <Collapse in={open}>{slotContent}</Collapse>
      </Paper>
    );
  }
);
