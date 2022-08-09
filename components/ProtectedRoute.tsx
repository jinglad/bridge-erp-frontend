import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [admin, setAdmin] = useState<boolean | undefined>();


  useEffect(() => {
    if (admin !== true && user?.email) {
      fetch(
        `${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/is-admin?email=${user?.email}`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
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
  }, [user]);

  useEffect(() => {
    if (!user && !admin) {
      router.push("/login");
    }
  }, [router, user]);

  return <>{(user && admin) ? children : null}</>;
};
export default ProtectedRoute;
