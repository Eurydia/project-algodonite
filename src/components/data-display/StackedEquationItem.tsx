import { Box, lighten, useTheme } from "@mui/material";
import { MathJax } from "better-react-mathjax";
import { memo, type FC } from "react";

type Props = { latex: string; isLast?: boolean };
export const StackedEquationItem: FC<Props> = memo(
  ({ latex, isLast }) => {
    const {
      palette: {
        primary: { light, dark },
      },
    } = useTheme();
    return (
      <Box
        sx={{
          paddingX: 2,
          borderLeftStyle: "solid",
          borderLeftColor: !isLast
            ? lighten(light, 0.5)
            : dark,
          borderLeftWidth: 8,
          backgroundColor: lighten(light, 0.87),
        }}
      >
        <MathJax dynamic>{latex}</MathJax>
      </Box>
    );
  }
);
