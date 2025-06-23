import { MathJax } from "better-react-mathjax";
import { memo, type FC } from "react";

type Props = {
  expr: string;
};
export const MathBlock: FC<Props> = memo(({ expr }) => {
  return <MathJax dynamic>{expr.normalize("NFC")}</MathJax>;
});
