import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<string | null>(null);

  // console.log(user);

  useEffect(() => {
<<<<<<< HEAD
    if (!user || user?.role !== "admin" || !accessToken) {
      router.push("/login").then();
    }
  }, [user, accessToken]);
=======
    const admin = localStorage.getItem("is-admin");
    const accessToken = localStorage.getItem("token");
    setIsAdmin(admin);
    if (admin !== "admin" || !accessToken) {
      router.push("/login").then();
    }
  }, [router.pathname, user, router]);
>>>>>>> 3608fb80dcf57a98b0f021a5445f16e4321f5b1c

  return <>{isAdmin === "admin" ? children : null}</>;
};
export default ProtectedRoute;
