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
                        data: res
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
                if (res === "Period Topic have max register") {
                    return {
                        status: 400,
                        error: "Đã đầy số lượng đăng kí"
                    }
                }
                else if (res === "Invalid Period Topic") {
                    return {
                        status: 400,
                        error: "Đề tài hiện tại không thể đăng kí"
                    }
                }
                else if (res === "You can not allowed register for that group") {
                    return {
                        status: 400,
                        error: "Nhóm hiện tại đang sai"
                    }
                }
                else if (res === "You can't register with member more than max member in Period Topic") {
                    return {
                        status: 400,
                        error: "Số lượng thành viên nhóm vượt quá số lượng đề tài cho phép"
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
                        error: "Lỗi đăng kí"
                    }
                }
            });
    },
    UpdatePTS: (params) => {
        const url = "/PeriodTopicStudents/my/" + params.id;
        return axiosClient.put(url, {
            planning: params.planning
        })
            .then((res) => {
                if (res === "You can not allowed edit this register") {
                    return {
                        status: 400,
                        error: "Đăng kí này không thuộc về nhóm của bạn"
                    }
                }
                else if (res === "This register have been approval") {
                    return {
                        status: 400,
                        error: "Không thể sửa đăng kí đã được duyệt"
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
                        error: "Lỗi đăng kí"
                    }
                }
            });
    },
    DeletePTS: (params) => {
        const url = "/PeriodTopicStudents/" + params.id;
        return axiosClient.delete(url)
            .then((res) => {
                if (res === "You can not allowed delete this register") {
                    return {
                        status: 400,
                        error: "Quyền xóa đăng kí thuộc về nhóm trưởng"
                    }
                }
                else if (res === "This register have been approval") {
                    return {
                        status: 400,
                        error: "Đăng kí đã được duyệt, không thể xóa"
                    }
                }
                else if (res.statusCode === 200) {
                    return {
                        status: 200,
                    }
                }
            });
    },
    GetPTSById: (params) => {
        const url = "/PeriodTopicStudents/" + params.id;
        return axiosClient.get(url)
            .then((res) => {
                if (res?.id !== "") {
                    return {
                        status: 200,
                        data: res
                    }
                }
                else {
                    return {
                        status: 400,
                        error: "Lấy dữ liệu thất bại"
                    }
                }
            });
    },
    GetPTS: (params) => {
        const url = "/PeriodTopicStudents";
        return axiosClient.get(url, {
            params
        })
            .then((res) => {
                if (res?.length >= 0) {
                    return {
                        status: 200,
                        data: res
                    }
                }
                else {
                    return {
                        status: 404,
                        error: "Lỗi lấy danh sách đăng kí"
                    }
                }
            });
    },
    ApprovalPTS: (params) => {
        const url = "/PeriodTopicStudents/Approval/" + params.id;
        return axiosClient.put(url)
            .then((res) => {
                if (res === "You can not allowed approval this register") {
                    return {
                        status: 400,
                        error: "Đăng kí này không thuộc quyền duyệt của bạn"
                    }
                }
                else if (res === "Invalid Period Topic") {
                    return {
                        status: 400,
                        error: "Đề tài này chưa được duyệt bởi Admin"
                    }
                }
                else {
                    return {
                        status: 200,
                    }
                }
            });
    },

}

export default PeriodTopicStudentApi;