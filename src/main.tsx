import { CssBaseline, ThemeProvider } from "@mui/material";
import { MathJaxContext } from "better-react-mathjax";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./main.css";
import { theme } from "./theme";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MathJaxContext
      renderMode="post"
      hideUntilTypeset="every"
      config={{
        loader: ["input/tex", "output/svg"],
        tex: {
          inlineMath: [["$", "$"]],
          displayMath: [["$$", "$$"]],
        },
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </MathJaxContext>
  </StrictMode>
);
