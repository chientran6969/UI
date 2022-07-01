import axiosClient from "./axiosClient";

const userApi = {
  login: (params) => {
    const url = "/users/authentication";
    return axiosClient.post(url, {
      email: params?.email,
      password: params?.password,
    });
  },

  logout: () => {
    const url = "/users/logout";
    return axiosClient.get(url);
  },
};

export default userApi;
