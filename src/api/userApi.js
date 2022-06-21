const userApi = {
  authenticate: (params) => {
    const url = "/user";
    return axiosClient.post(url, { params });
  },
};

export default userApi;
