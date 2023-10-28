import { useRouter } from "next/router";
import React, { useEffect } from "react";
import useUserStore from "../store/userStore";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, accessToken } = useUserStore((state) => state);
  const router = useRouter();

  useEffect(() => {
    if (user?.role !== "admin" || !accessToken) {
      router.push("/login").then();
    }
  }, [user, router, accessToken]);

  return <>{user?.role === "admin" ? children : null}</>;
};
export default ProtectedRoute;
