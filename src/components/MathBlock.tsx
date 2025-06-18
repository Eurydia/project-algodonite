import { Box } from "@mui/material";
import { MathJax } from "better-react-mathjax";
import { type FC } from "react";

type Props = {
  expr: string;
};
export const MathBlock: FC<Props> = ({ expr }) => {
  return (
    <Box component="div">
      <MathJax dynamic>{expr.normalize("NFC")}</MathJax>
    </Box>
  );
};
