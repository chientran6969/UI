import axiosClient from "./axiosClient";
const PeriodApi = {
    AddPeriod: (params) => {
        const url = "/Periods";
        return axiosClient.post(url, params)
            .then((res) => {
                if (res?.name !== "") {
                    return {
                        status: 201,
                        data: res
                    }
                }
                else if (res = "Period is have exist") {
                    return {
                        status: 400,
                        error: "Trùng tên"
                    }
                }
            });
    },
    GetPeriodList: () => {
        const url = "/periods";
        return axiosClient.get(url)
            .then((res) => {
                if (res.length > 0) {
                    return {
                        status: 200,
                        data: res,
                        error: ''
                    }
                } else {
                    return {
                        status: 400,
                        data: null,
                        error: 'Khong get duoc periods'
                    }
                }
            });
    },
    EditPeriod: (params) => {
        const url = "/Periods/" + params.id;
        return axiosClient.put(url, {
            name: params.name,
            start: params.start,
            end: params.end,
            maxTopic: params.maxTopic
        })
            .then((res) => {
                if (res === "Period is exist") {
                    return {
                        status: 400,
                        error: "Tên đợt đã tồn tại"
                    }
                } 
                else if (res === "This period is more topics than request change ") {
                    return {
                        status: 400,
                        error: "Đợt đang có nhiều đề tài hơn số tối đa cần thai đổi"
                    }
                }
                else if (res.name !== "") {
                    return {
                        status: 200,
                        data: res
                    }
                }
                else {
                    return {
                        status: 404,
                        error: "Lỗi rồi"
                    }
                }

            });
    },

    DeletePeriod: (params) => {
        const url = "/Periods/"+params.id;
        return axiosClient.delete(url)
            .then((res) => {
                if(res === "Can't delete Period have topic"){
                    return {
                        status: 400,
                        error: "Không thể xóa đợt đăng kí đã có đề tài"
                    }
                }
                else if(res === "Can't delete Period have list student"){
                    return {
                        status: 400,
                        error: "Không thể xóa đợt đăng kí đã có danh sách sinh viên thực hiện"
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

export default PeriodApi;