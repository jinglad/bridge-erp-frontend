import { Box, Container } from "@mui/material";
import EmailLogin from "../components/Login/EmailLogin";

const Login = () => {
  return (
    <Container>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Box>
          <EmailLogin />
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
