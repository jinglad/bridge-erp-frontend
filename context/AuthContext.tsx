import { GoogleAuthProvider, onAuthStateChanged, onIdTokenChanged, signInWithPopup, signOut } from "firebase/auth";
import { Router, useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../config/firebase";

const AuthContext = createContext<any>({});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(false);
  const [token, setToken] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
        localStorage.removeItem("token");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const googleLogin = () => {
    const provider = new GoogleAuthProvider();
    const user = signInWithPopup(auth, provider);
    //update user data on the server
    user.then((user) => {
      auth.updateCurrentUser(user.user);
      setUser(user.user);
      fetch(`${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/login`, {
        method: "POST",
        headers: {
          "content-type":"application/json",
        },
        body: JSON.stringify(user.user)
      }).then(res => {
        if(res.ok) return res.json();
      }).then(data => {
        checkAdmin(user.user.email, data?.accessToken).then(res => {
          if(res?.admin) {
            sessionStorage.setItem("is-admin", "admin");
            router.push("/").then();
          } else {
            alert("You are not admin");
          }
        });
        localStorage.setItem("token", data?.accessToken);
      })
      .catch(error => console.log(error))
    });
    return user;
  };

  const logout = async () => {
    setUser(null);
    await signOut(auth);
    localStorage.removeItem("token");
    sessionStorage.removeItem("is-admin");
    router.push("/login").then();
  };

  return (
    <AuthContext.Provider value={{ user, logout, googleLogin }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};


const checkAdmin = async (email:string|null, token: string|null) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/is-admin?email=${email}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "authorization": `Bearer ${token}`
      },
  })

  if(response.ok) {
    return await response.json();
  } 
}
