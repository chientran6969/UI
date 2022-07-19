import axiosClient from "./axiosClient";

const TopicApi = {
    AddTopic: (params) => {
        const url = "/Topics";
        return axiosClient.post(url, {
                name: params.name,
                major: params.major,
                description: params.description
            })
            .then((res) => {
                if(res === "Topic is exist"){
                    return {
                        status: 400,
                        error: "Tên đề tài đã tồn tại trong danh sách"
                    }
                }
                else if(res?.name !== ""){
                    return {
                        status: 200,
                        data:res
                    }
                }
                else{
                    return {
                        status: 404,
                        error: "Lỗi thêm đề tài"
                    }
                }
            });
    },

    DeleteTopic: (params) => {
        const url = "/Topics/"+params.id;
        return axiosClient.delete(url)
            .then((res) => {
                if(res === "You can not delete topic have been assign"){
                    return {
                        status: 400,
                        error: "Không thể xóa đề tài đã được sinh viên đăng kí"
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

    GetTopicList: () => {
        const url = "/Topics";
        return axiosClient.get(url)
            .then((res) => {
                if (res.length >= 0) {
                    return {
                        status: 200,
                        data: res,
                    }
                } else {
                    return {
                        status: 400,
                        error: 'Khong get duoc topics'
                    }
                }
            });
    },

    GetTopicDetail: (params) => {
        const url = "/Topics/"+params.id;
        return axiosClient.get(url)
            .then((res) => {
                console.log(res);
            });
    },
}

export default TopicApi;