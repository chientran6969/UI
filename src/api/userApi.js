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

  loginWithGG: (params) => {
    const url = "/users/ExternalLogin";
    return axiosClient.post(url, {
      provider: "Google",
      idToken: params,
    })
    .then((response) => {
      //console.log(response);
      
      if(response.token !== '' && response?.error === undefined){
        return {
          status: 200,
          data: response
        }
      }

      if(response.error !== ''){
        return {
          status: 400,
          error: response.error
        }
      }
    });
  },
  GetTeacherList:(params) =>{
    const url = "/users/teachers";
        return axiosClient.get(url)
            .then((res) => {
              if(res?.length >=0){
                return {
                  status: 200,
                  data: res
                }
              }else{
                return {
                  status: 404,
                  error: "Không lấy được danh sách giáo viên"
                }
              }
            });
  }
};

export default userApi;
