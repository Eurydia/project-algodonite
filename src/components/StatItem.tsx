import { Collapse, Stack, Typography } from "@mui/material";
import {
  memo,
  useCallback,
  useMemo,
  useState,
  type FC,
} from "react";
import { MathBlock } from "./MathBlock";

type Props = {
  label: string;
  expr?: string;
  value?: number | string;
  exprExt?: string;
};
export const StatItem: FC<Props> = memo(
  ({ label, expr, value, exprExt }) => {
    const [showExpr, setShowExpr] = useState(false);

    const valueMsg = useMemo(() => {
      return value !== undefined
        ? `$${value.toLocaleString("fullwide")}$`
        : "";
    }, [value]);

    const exprMsg = useMemo(() => {
      if (expr === undefined) {
        return "";
      }
      const exprExtMsg =
        exprExt !== undefined ? `\\\\${exprExt}` : "";
      const boxedValueMsg =
        value !== undefined
          ? `\\\\&=\\boxed{${value}}`
          : "";

      return `$$\\begin{align*}
              ${expr}
              ${exprExtMsg}
              ${boxedValueMsg}
              \\end{align*}$$`;
    }, [expr, exprExt, value]);

    const handleToggleExpr = useCallback(
      () => setShowExpr((prev) => !prev),
      []
    );

    return (
      <Stack
        flexWrap="wrap"
        useFlexGap
      >
        <Stack
          spacing={1}
          useFlexGap
          flexDirection="row"
          justifyContent="space-between"
        >
          <MathBlock expr={`${label}: ${valueMsg}`} />
          {expr !== undefined && (
            <Typography
              onClick={handleToggleExpr}
              sx={{
                "userSelect": "none",
                "cursor": "pointer",
                "&:hover": {
                  textDecorationLine: "underline",
                },
              }}
            >
              {showExpr ? "(ซ่อน)" : "(แสดง)"}
            </Typography>
          )}
        </Stack>
        {expr !== undefined && (
          <Collapse in={showExpr}>
            <MathBlock expr={exprMsg} />
          </Collapse>
        )}
      </Stack>
    );
  }
);
