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

        if (response.token !== '' && response?.error === undefined) {
          return {
            status: 200,
            data: response
          }
        }

        if (response.error !== '') {
          return {
            status: 400,
            error: response.error
          }
        }
      });
  },
  GetTeacherList: (params) => {
    const url = "/users/teachers";
    return axiosClient.get(url)
      .then((res) => {
        if (res?.length >= 0) {
          return {
            status: 200,
            data: res
          }
        } else {
          return {
            status: 404,
            error: "Không lấy được danh sách giáo viên"
          }
        }
      });
  },
  GetLocalAccount: (params) => {
    const url = "/users/all";
    return axiosClient.get(url)
      .then((res) => {
        if (res?.length >= 0) {
          return {
            status: 200,
            data: res
          }
        } else {
          return {
            status: 404,
            error: "Không lấy được danh sách giáo viên"
          }
        }
      });
  },
  AddAccount: (params) => {
    const url = "/Users";
    return axiosClient.post(url, {
      email: params.email,
      roleId: params.roleId,
    })
      .then((res) => {
        if (res === "Invalid Role") {
          return {
            status: 400,
            error: "Sai quyền"
          }
        }
        else if (res === "User is exist") {
          return {
            status: 400,
            error: "Người dùng đã tồn tại"
          }
        }
        else if (res?.id !== "") {
          return {
            status: 200,
            data: res
          }
        }
        else {
          return {
            status: 400,
            error: "Lỗi thêm người dùng"
          }
        }
      });
  },
  DecenAccount: (params) => {
    const url = "/Users/Decen";
    return axiosClient.put(url, {
      id: params.id,
      role: params.role,
    })
      .then((res) => {
        if (res.statusCode === 200) {
          return {
            status: 200,
            message: "Đổi quyền thành công"
          }
        }
        else{
          return {
            status: 400,
            error: "Phân quyền thất bại"
          }
        }
      });
  },
  ActiveAccount: (params) => {
    const url = "/Users/ChangeState";
    return axiosClient.put(url, {
      active: params.active,
      id: params.id
    })
      .then((res) => {
        if(res?.id !== ""){
          return {
            status: 200,
            data: res
          }
        }
        else{
          return {
            status: 400,
            error: "Lỗi kích hoạt tài khoản"
          }
        }
      });
  },
  GetMyInfo: (params) => {
    const url = "/Users/MyInfo";
    return axiosClient.get(url,{params})
      .then((res) => {
        if (res?.id !== ""){
          return {
            status: 200,
            data: res
          }
        }else{
          return {
            status: 404,
            error: "Lỗi lấy dữ liệu"
          }
        }
      });
  },
  ChangeMyInfo: (params) => {
    const url = "/Users/MyInfo";
    return axiosClient.put(url, {
      id: params.id,
      lastName: params.lastName,
      firstName: params.firstName,
      phone: params.phone,
      birthday: params.birthday
    })
      .then((res) => {
        if(res.status === 400){
          return {
            status: 400,
            error: "Lỗi thay đổi thông tin"
          }
        }
        else if (res.id !== ""){
          return {
            status: 200,
            data: res.data
          }
        }
        else{
          return {
            status: 400,
            error: "Lỗi thay đổi thông tin"
          }
        }
      });
  },
  ChangePassword: (params) => {
    const url = "/Users/changePassword";
    return axiosClient.put(url, {
      id: params.id,
      oldPassword: params.oldPassword,
      newPassword: params.newPassword
    })
      .then((res) => {
        console.log(res)
        if(res === "Invalid User"){
          return {
            status: 400,
            error: "Không tìm thấy người dùng này"
          }
        }
        else if(res === "Invalid Password or User"){
          return {
            status: 400,
            error: "Mật khẩu không chính xác"
          }
        }else if(res.statusCode === 200){
          return {
            status: 200,
          }
        }
      });
  },
};

export default userApi;
