import axiosClient from "./axiosClient";

const PeriodTopicStudentApi = {
    GetOwnPTSInPeriod: (params) => {
        const url = "/PeriodTopicStudents/my";
        return axiosClient.get(url, {
            params
        })
            .then((res) => {
                if (res?.length >= 0) {
                    return {
                        status: 200,
                        data: res[0]
                    }
                }
                else {
                    return {
                        status: 404,
                        error: "Lỗi lấy danh sách đăng kí trong học kì"
                    }
                }
            });
    },
    AddPTS: (params) => {
        const url = "/PeriodTopicStudents";
        return axiosClient.post(url, {
            periodTopicId: params.periodTopicId,
            groupId: params.groupId,
            planning: params.planning
        })
            .then((res) => {
                if(res === "Period Topic have max register"){
                    return {
                        status: 400,
                        error: "Đã đầy số lượng đăng kí"
                    }
                }
                else if(res === "Invalid Period Topic"){
                    return {
                        status: 400,
                        error: "Đề tài hiện tại không thể đăng kí"
                    }
                }
                else if(res === "You can not allowed register for that group"){
                    return {
                        status: 400,
                        error: "Nhóm hiện tại đang sai"
                    }
                }
                else if(res === "You can't register with member more than max member in Period Topic"){
                    return {
                        status: 400,
                        error: "Số lượng thành viên nhóm vượt quá số lượng đề tài cho phép"
                    }
                }
                else if(res?.id !== ""){
                    return {
                        status: 200,
                        data: res
                    }
                }
                else{
                    return {
                        status: 400,
                        error: "Lỗi đăng kí"
                    }
                }
            });
    },
}

export default PeriodTopicStudentApi;