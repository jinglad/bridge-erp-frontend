import { Box, Button, Typography } from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { auth } from "../../config/firebase";
import { checkAdmin, useAuth } from "../../context/AuthContext";

type Inputs = {
  email: string;
  password: string;
};

const EmailLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Inputs>();

  const [loading, setLoading] = useState<boolean>(false);

  const { setUser } = useAuth();
  const router = useRouter();

  const handleSuccess = (data: ILoginResponse) => {
    const { accessToken, user } = data;
    // console.log(user);
    if (user?.role === "admin") {
      setUser({
        email: user.email,
        id: user._id,
        role: user.role,
      });
  };

  return (
    <Box sx={{ py: 3, px: 4, width: "400px" }}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography sx={{ textAlign: "center", mb: 3 }} variant="h4">
          Sign In
        </Typography>
        <Box sx={{ mb: 4, width: "100%" }}>
          <Box
            component="input"
            type="email"
            placeholder="Email Address"
            sx={{
              width: "100%",
              py: 2,
              px: 4,
              border: "1px solid lightgray",
              borderRadius: "5px",
            }}
            {...register("email", { required: true })}
          />
          {errors.email && (
            <Box component="span" sx={{ color: "red" }}>
              Email is required
            </Box>
          )}
        </Box>
        <Box sx={{ mb: 4, width: "100%" }}>
          <Box
            component="input"
            type="password"
            placeholder="Password"
            sx={{
              width: "100%",
              py: 2,
              px: 4,
              border: "1px solid lightgray",
              borderRadius: "5px",
            }}
            {...register("password", { required: true })}
          />
          {errors.password && (
            <Box component="span" sx={{ color: "red" }}>
              Password is required
            </Box>
          )}
        </Box>
        <Box sx={{ width: "100%" }}>
          <Button
            type="submit"
            disabled={loading}
            sx={{
              width: "100%",
            }}
          >
            {loading ? "Loading..." : "Login"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EmailLogin;
