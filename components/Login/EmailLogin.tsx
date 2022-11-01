import { Box, Button, Typography } from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import React from "react";
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

  const { setUser } = useAuth();
  const router = useRouter();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((user) => {
        setUser(user.user);
        fetch(`${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/login`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(user.user),
        })
          .then((res) => {
            if (res.ok) return res.json();
          })
          .then((data) => {
            checkAdmin(user.user.email, data.accessToken).then((res) => {
              if (res?.admin) {
                localStorage.setItem("token", data.accessToken);
                localStorage.setItem("is-admin", "admin");
                router.push("/").then();
              } else {
                alert("You are not admin");
              }
            });
            reset();
          })
          .catch((error) => {
            console.log(error);
            reset();
          });
      })
      .catch((error) => {
        if (error.code === "auth/wrong-password") alert("Wrong password. Please try again with correct password.");
        reset();
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
            disabled={isSubmitting}
            sx={{
              width: "100%",
            }}
          >
            {isSubmitting ? "Loading..." : "Login"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EmailLogin;
