import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useUserStore from "../../store/userStore";

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

  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const onSubmit: SubmitHandler<Inputs> = (input) => {
    const { email } = input;
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/user/login`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(input),
    })
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((data) => {
        if (data?.data?.user?.role === "admin") {
          setUser({
            email,
            id: data?.data?.user?._id,
            role: data?.data?.user?.role,
          });
          router.push("/");
          setLoading(false);
        } else {
          toast.error("You are not admin");
          setLoading(false);
        }

        reset();
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
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
