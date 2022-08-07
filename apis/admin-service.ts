import http from "./http-common";

export const getAdmin = async () => {
  const { data } = await http.get("/admins");
  return data;
};

export const deleteAdmin = async (uid: string) => {
  try {
    const { data } = await http.delete<{ msg: string }>("/remove-admin", {
      data: {
        uid: uid,
      },
    });
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};

export const createAdmin = async (email: string) => {
  try {
    const { data } = await http.post<{ msg: string }>("/admin", { email });
    return data;
  } catch (error: any) {
    return error.response.data.message;
  }
};
