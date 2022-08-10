import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, logout, token } = useAuth();
  const router = useRouter();
  const [admin, setAdmin] = useState<boolean | undefined>();
  const accessToken = typeof window !== "undefined" && localStorage.getItem("token");


  useEffect(() => {
    if (admin !== true && user?.email && accessToken) {
      fetch(
        `${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/is-admin?email=${user?.email}`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${accessToken}`
          },
        }
      )
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          }
        })
        .then((data) => {
          if (data?.admin) {
            setAdmin(true);
          } else {
            logout();
            setAdmin(false);
            localStorage.removeItem("token");
          }
        })
        .catch();
    }
  }, [user, accessToken]);

  useEffect(() => {
    if (!user && !admin && accessToken) {
      router.push("/login");
    }
  }, [router, user, accessToken]);

  return <>{(user && admin && accessToken) ? children : null}</>;
};
export default ProtectedRoute;
