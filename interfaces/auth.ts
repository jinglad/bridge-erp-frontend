export interface ILoginResponse {
  user: IUser;
  accessToken: string;
}

export interface IUser {
  _id: string;
  role: string;
  email: string;
}
