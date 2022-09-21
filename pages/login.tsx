import { Box, Button, Container } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import EmailLogin from "../components/Login/EmailLogin";
import LoginButton from "../components/Login/LoginButton";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { user, logout} = useAuth();
  const router = useRouter();
  const [admin, setAdmin] = useState<null | string>(null);

  useEffect(() => {
    setAdmin(sessionStorage.getItem("is-admin"));
  },[user])
  
  

  return (
    <Container>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <h1 className="text-center my-3 ">Sign in</h1>
        {(admin !== "admin") ? <LoginButton /> : <Button onClick={async () => await logout()}>Logout</Button>}
        {/* <EmailLogin /> */}
      </Box>
    </Container>
  );
};

export default Login;
