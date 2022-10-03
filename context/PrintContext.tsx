import { createContext, useState } from "react";

export const PrintContext = createContext<any>({});

export const PrintContextProvider = ({children}:any) => {
  const [value, setValue] = useState({});
  return (
    <PrintContext.Provider value={{ value, setValue }}>
      {children}
    </PrintContext.Provider>
  );
}