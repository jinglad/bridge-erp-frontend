import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, logout, token } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<string | null>(null);


  // useEffect(() => {
  //   if (admin !== true && user?.email && accessToken) {
  //     fetch(
  //       `${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/is-admin?email=${user?.email}`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "content-type": "application/json",
  //           "authorization": `Bearer ${accessToken}`
  //         },
  //       }
  //     )
  //       .then((res) => {
  //         if (res.status === 200) {
  //           return res.json();
  //         }
  //       })
  //       .then((data) => {
  //         if (data?.admin) {
  //           setAdmin(true);
  //         } else {
  //           logout();
  //           setAdmin(false);
  //           localStorage.removeItem("token");
  //         }
  //       })
  //       .catch();
  //   }
  // }, [user, accessToken]);

  useEffect(() => {
    const admin = localStorage.getItem("is-admin");
    const accessToken = localStorage.getItem("token");
    setIsAdmin(admin);
    if (admin !== "admin" || !accessToken) {
      router.push("/login").then();
    }
  }, [router.pathname, user]);

  return <>{isAdmin === "admin" ? children : null}</>;
};
export default ProtectedRoute;
