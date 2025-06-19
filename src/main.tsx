import { MathJaxContext } from "better-react-mathjax";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./main.css";

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
      <App />
    </MathJaxContext>
  </StrictMode>
);
