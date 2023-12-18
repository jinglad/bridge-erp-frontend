import { useRouter } from "next/router";
import React, { useEffect } from "react";
import useUserStore from "../store/userStore";
import { getCookie } from "cookies-next";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUserStore((state) => state);
  const accessToken = getCookie("token");
  const router = useRouter();

  // console.log(user);

  useEffect(() => {
    if (!user || user?.role !== "admin" || !accessToken) {
      router.push("/login").then();
    }
  }, [user, accessToken]);

  return <>{user?.role === "admin" ? children : null}</>;
};
export default ProtectedRoute;
