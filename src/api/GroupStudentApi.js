import axiosClient from "./axiosClient";

const GroupStudentApi = {
    GetMyGroupInPeriod: (params) => {
        const url = "/GroupStudents/my";
        return axiosClient.get(url, {
                params
            })
            .then((res) => {
                if(res?.status === 204){
                    return {
                        status: 400,
                        error: "Không có nhóm"
                    }
                }
                if(res?.name){
                    return{
                        status: 200,
                        data: res
                    }
                }
            });
    },

    AddGroup: (params) => {
        const url = "/GroupStudents";
        return axiosClient.post(url, {
            name: params.name,
            periodId: params.periodId
        })
        .then((res) => {
            if(res ==="You have not allowed create group in this period"){
                return {
                    status: 400,
                    error: "Bạn không thuộc danh sách thực hiện đề tài kì này"
                }
            }else if(res === "You can not lead 2 group in a period"){
                return {
                    status: 400,
                    error: "Bạn không thể tạo hai nhóm trong một kì"
                }
            }
            else if(res === "Name of group is exist"){
                return {
                    status: 400,
                    error: "Tên nhóm đã tồn tại, chọn tên khác"
                }
            }
            if(res.name !== ""){
                return {
                    status: 200,
                    data: res
                }
            }
        });
    },

    EditGroup: (params) => {
        const url = "/GroupStudents/"+params.groupId;
        return axiosClient.put(url, {
                name: params.name
            })
            .then((res) => {
                if(res === "Name of group is exist"){
                    return {
                        status: 400,
                        error: "Tên nhóm đã tồn tại trong danh sách, chọn tên khác"
                    }
                }else if(res.name !== ""){
                    return {
                        status: 200,
                        data: res
                    }
                }
                else{
                    return {
                        status: 404,
                        error: "Lỗi rồi"
                    }
                }
                
            });
    },

    DeleteGroup: (params) => {
        const url = "/GroupStudents/"+params.groupId;
        return axiosClient.delete(url)
            .then((res) => {
                if(res === "You can't delete group been assign topic"){
                    return {
                        status: 400,
                        error: "Không thể xóa nhóm đã đăng kí đề tài"
                    }
                }
                else if(res.statusCode === 200){
                    return {
                        status: 200,
                    }
                }
            });
    },
}


export default GroupStudentApi;