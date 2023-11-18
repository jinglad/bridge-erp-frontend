import { Box, Button, Container } from "@mui/material";
import { useEffect, useState } from "react";
import EmailLogin from "../components/Login/EmailLogin";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { user, logout } = useAuth();
  const [admin, setAdmin] = useState<null | string>(null);

  useEffect(() => {
    setAdmin(localStorage.getItem("is-admin"));
  }, [user]);

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
          {admin !== "admin" ? <EmailLogin /> : <Button onClick={() => logout()}>Logout</Button>}
          {/* <EmailLogin /> */}
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
