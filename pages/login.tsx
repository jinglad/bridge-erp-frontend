import { Box, Button, Container } from "@mui/material";
import LoginButton from "../components/Login/LoginButton";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { user, logout } = useAuth();

  return (
    <Container>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <h1 className="text-center my-3 ">Sign in</h1>
        {!user ? <LoginButton /> : <Button onClick={async () => await logout()}>Logout</Button>}
      </Box>
    </Container>
  );
};

export default Login;
