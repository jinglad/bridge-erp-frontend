import { createTheme } from "@mui/material";
import { blue, purple } from "@mui/material/colors";

export const theme = createTheme({
  palette: {
    primary: {
      main: blue[900],
    },
  },

  components: {
    MuiButtonGroup: {
      defaultProps: {
        disableRipple: true,
        disableElevation: true,
        variant: "contained",
      },
    },
    MuiButton: {
      defaultProps: {
        variant: "contained",
        disableRipple: true,
        disableElevation: true,
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "standard",
        size: "small",
      },
    },
  },
});
