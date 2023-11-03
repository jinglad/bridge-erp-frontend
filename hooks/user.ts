import { useMutation } from "react-query";
import { AuthService } from "../apis/auth-service";
import { toast } from "react-toastify";
import { IError } from "../interfaces/common";
import { ILoginResponse } from "../interfaces/auth";

export const useLogin = ({
  handleSuccess,
}: {
  handleSuccess: (data: ILoginResponse) => void;
}) => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => {
      return AuthService.login(email, password);
    },
    onError: (error: IError) => {
      toast.error(error?.response?.data?.message);
    },
    onSuccess: (data) => {
      handleSuccess(data.data);
    },
  });
};
