import { Box, Button, Container } from "@mui/material";
import EmailLogin from "../components/Login/EmailLogin";
import useUserStore from "../store/userStore";

const Login = () => {
  const { user, logout } = useUserStore((state) => state);

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
          {user?.role !== "admin" ? (
            <EmailLogin />
          ) : (
            <Button onClick={() => logout()}>Logout</Button>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
