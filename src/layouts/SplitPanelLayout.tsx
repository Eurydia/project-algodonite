import { Grid } from "@mui/material";
import { memo, type FC, type ReactNode } from "react";

type Props = {
  left: ReactNode;
  right: ReactNode;
};
export const SplitPanelLayout: FC<Props> = memo(
  ({ left, right }) => {
    return (
      <Grid
        container
        spacing={2}
        padding={2}
        sx={{
          backgroundColor: "background.default",
          height: { md: "100vh" },
          maxHeight: { md: "100vh" },
        }}
      >
        <Grid
          size={{ xs: 12, md: 4 }}
          sx={{
            height: { md: "100%" },
            maxHeight: { md: "100vh" },
          }}
        >
          {left}
        </Grid>
        <Grid
          size={{ xs: 12, md: 8 }}
          sx={{
            height: { md: "100%" },
            maxHeight: { md: "100vh" },
            overflowY: "auto",
            scrollbarWidth: "thin",
          }}
        >
          {right}
        </Grid>
      </Grid>
    );
  }
);
