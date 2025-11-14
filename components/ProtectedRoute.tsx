import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<string | null>(null);

  // console.log(user);

  useEffect(() => {
    if (!user || user?.role !== "admin" || !accessToken) {
      router.push("/login").then();
    }
  }, [user, accessToken]);

  return <>{isAdmin === "admin" ? children : null}</>;
};
export default ProtectedRoute;
