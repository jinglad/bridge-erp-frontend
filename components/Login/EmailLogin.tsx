import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useUserStore from "../../store/userStore";
import { setCookie } from "cookies-next";
import { appConfig } from "../../config/appConfig";
import { useLogin } from "../../hooks/user";
import { ILoginResponse } from "../../interfaces/auth";

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
  const { setUser } = useUserStore((state) => state);
  const router = useRouter();

  const handleSuccess = (data: ILoginResponse) => {
    const { accessToken, user } = data;
    console.log(user);
    if (user?.role === "admin") {
      setUser({
        email: user.email,
        id: user._id,
        role: user.role,
      });
      setCookie("token", accessToken, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
      });
      reset();
      router.push("/");
    } else {
      toast.error("You are not admin");
    }
  };

  const { mutate: login, isLoading } = useLogin({
    handleSuccess,
  });

  const onSubmit: SubmitHandler<Inputs> = (input) => {
    const { email, password } = input;
    login({
      email,
      password,
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
            disabled={isLoading}
            sx={{
              width: "100%",
            }}
          >
            {isLoading ? "Loading..." : "Login"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EmailLogin;
