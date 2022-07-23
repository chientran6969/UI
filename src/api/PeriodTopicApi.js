import axiosClient from "./axiosClient";

const PeriodTopicApi = {
    GetTopicInPeriod: (params) => {
        const url = "/PeriodTopics";
        return axiosClient.get(url, {
            params
        })
            .then((res) => {
                if (res?.length >= 0) {
                    return {
                        status: 200,
                        data: res
                    }
                } else {
                    return {
                        status: 404,
                        error: "Không tìm thấy đề tài nào"
                    }
                }
            });
    },

    ResponsePeriodTopic: (params) => {
        const url = "/PeriodTopics/Response";
        let data = {
            id: params.id,
            accept: params.accept
        }
        return axiosClient.put(url, data)
            .then((res) => {
                if (res === "You can not response this Period Topic") {
                    return {
                        status: 400,
                        error: "Không thể phải hồi đề tài này"
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
                        error: "Lỗi phản hồi"
                    }
                }
            });
    },

    AddPeriodTopic: (params) => {
        const url = "/PeriodTopics";
        let returnError = {
            status: 400,
            error: ""
        }
        return axiosClient.post(url, {
            periodId: params.periodId,
            topicId: params.topicId,
            teacherId: params.teacherId,
            maxRegister: params.maxRegister,
            maxGroupMember: params.maxMember,
        })
            .then((res) => {
                if (res === "You can not add Period Topic two times") {
                    returnError.error = "Bạn không thể thêm một kì 2 đề giống nhau";
                    return returnError;
                } else if (res === "Topic in Period is full") {
                    returnError.error = "Đợt đăng kí này đã đầy đề tài";
                    return returnError;
                } else if (res?.id !== "") {
                    return {
                        status: 200,
                        data: res
                    }
                }
                else {
                    returnError.error = "Lỗi thêm đề vào đợt";
                    return returnError;
                }
            });
    },
    AddPeriodTopicByS: (params) => {
        const url = "/PeriodTopics";
        let returnError = {
            status: 400,
            error: ""
        }
        return axiosClient.post(url, {
            periodId: params.periodId,
            topicId: params.topicId,
            teacherId: params.teacherId,
            groupStudentId: params.groupStudentId,
            maxRegister: params.maxRegister,
            maxGroupMember: params.maxMember,
        })
            .then((res) => {
                if (res === "You can not add Period Topic two times") {
                    returnError.error = "Bạn không thể thêm một kì 2 đề giống nhau";
                    return returnError;
                } else if (res === "Topic in Period is full") {
                    returnError.error = "Đợt đăng kí này đã đầy đề tài";
                    return returnError;
                } else if (res?.id !== "") {
                    return {
                        status: 200,
                        data: res
                    }
                }
                else {
                    returnError.error = "Lỗi thêm đề vào đợt";
                    return returnError;
                }
            });
    },

    GetPeriodTopicDetail: (params) => {
        const url = "/PeriodTopics/"+params.id;
        return axiosClient.get(url)
            .then((res) => {
                if(res?.id !== ""){
                    return {
                        status: 200,
                        data: res
                    }
                }
                else{
                    return {
                        status: 404,
                        error: "Lỗi lấy dữ liệu"
                    }
                }
            });
    },

    UpdatePeriodTopic: (params) => {
        const url = "/PeriodTopics/"+ params.id;
        let input = {
            teacherId: params.teacherId,
            maxRegister: params.maxRegister,
            maxGroupMember: params.maxGroupMember,
            periodId: params.periodId,
            topicId: params.topicId
        }
        return axiosClient.put(url, input)
            .then((res) => {
                if(res === "You can not update period topic, which have been registered"){
                    return {
                        status: 400,
                        error: "Không thể sửa khi có sinh viên đăng kí"
                    }
                }
                else if(res === "You can not update Period Topic, which have been approval or reject"){
                    return {
                        status: 400,
                        error: "Đề tài đã được chấp nhận hoặc từ chối, không thể sửa"
                    }
                }
                else if (res?.id != ""){
                    return {
                        status: 200,
                        data: res
                    }
                }
                else{
                    return {
                        status: 400,
                        error: "Lỗi chỉnh sửa"
                    }
                }
            });
    },

    DeletePeriodTopic: (params) => {
        const url = "/PeriodTopics/"+params.id;
        return axiosClient.delete(url)
            .then((res) => {
                if(res === "You can not delete Period Topic have been registered"){
                    return {
                        status: 400,
                        error: "Không thể xóa đề tài đã có đăng kí"
                    }
                }
                else if(res === "You can not delete Period Topic have been approvaled"){
                    return {
                        status: 400,
                        error: "Không thể xóa đợt đề tài đã được duyệt"
                    }
                }
                else if(res.statusCode === 200){
                    return {
                        status: 200,
                    }
                }
                else{
                    return {
                        status: 400,
                        error: "Lỗi xóa"
                    }
                }
            });
    },
}

export default PeriodTopicApi;