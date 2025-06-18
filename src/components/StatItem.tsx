import { Collapse, Stack, Typography } from "@mui/material";
import { useState, type FC } from "react";
import { MathBlock } from "./MathBlock";

type Props = {
  label: string;
  expr?: string;
  value?: number | string;
  exprExt?: string;
};
export const StatItem: FC<Props> = ({
  label,
  expr,
  value,
  exprExt,
}) => {
  const [showExpr, setShowExpr] = useState(false);

  const v =
    value !== undefined
      ? `$${value.toLocaleString("fullwide")}$`
      : "";
  return (
    <Stack
      spacing={1}
      flexWrap="wrap"
      useFlexGap
    >
      <Stack
        spacing={1}
        useFlexGap
        flexDirection="row"
        justifyContent="space-between"
      >
        <MathBlock expr={`${label}: ${v}`} />
        {expr !== undefined && (
          <Typography
            sx={{
              "cursor": "pointer",
              "&:hover": {
                textDecorationLine: "underline",
              },
            }}
            onClick={() => setShowExpr((prev) => !prev)}
          >
            {showExpr ? "(ซ่อน)" : "(แสดง)"}
          </Typography>
        )}
      </Stack>
      {expr !== undefined && (
        <Collapse in={showExpr}>
          <MathBlock
            expr={`$$\\begin{align*}
              ${expr}
              ${
                exprExt !== undefined
                  ? `\\\\${exprExt}`
                  : ""
              }
              ${
                value !== undefined
                  ? `\\\\&=\\boxed{${value}}`
                  : ""
              }
              \\end{align*}$$`}
          />
        </Collapse>
      )}
    </Stack>
  );
};
