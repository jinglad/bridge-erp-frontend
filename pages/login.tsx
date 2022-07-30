import { Box, Button, Container } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import LoginButton from "../components/Login/LoginButton";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { user, logout, admin } = useAuth();
  const accessToken:any = useRef(null);
  const router = useRouter();
  
  

  return (
    <Container>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <h1 className="text-center my-3 ">Sign in</h1>
        {(!user && !admin) ? <LoginButton /> : <Button onClick={async () => await logout()}>Logout</Button>}
      </Box>
    </Container>
  );
};

export default Login;
