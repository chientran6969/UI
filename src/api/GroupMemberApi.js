import axiosClient from "./axiosClient";

const GroupMemberApi = {
    AddMemeber: (params) => {
        const url = "/GroupMembers";
        return axiosClient.post(url, {
                groupId: params.groupId,
                studentId: params.studentId
            })
            .then((res) => {
                if(res ==="You not allow add member for this group"){
                    return {
                        status: 400,
                        error: "Chỉ có nhóm trưởng mới có thể thêm thành viên"
                    }
                }
                else if(res === "You can not add yourself to group"){
                    return {
                        status: 400,
                        error: "Bạn không thể tự thêm mình vào nhóm"
                    }
                }
                else if(res === "This group have maximum member"){
                    return {
                        status: 400,
                        error: "Nhóm đã có số lượng thành viên tối đa"
                    }
                }
                else if(res === "This student not allow work in this period"){
                    return {
                        status: 400,
                        error: "Thành viên được thêm không có trong danh sách thực hiện kì này"
                    }
                }
                else if(res === "You can not add member to group, which assigned topic"){
                    return {
                        status: 400,
                        error: "Không thể thêm thành viên cho nhóm đang thực hiện đề tài"
                    }
                }
                else if(res === "This student have exist in another group in this period"){
                    return {
                        status: 400,
                        error: "Không thể thêm thành viên đang ở nhóm khác"
                    }
                }
                else if(res === "This student is exist in this group"){
                    return {
                        status: 400,
                        error: "Sinh viên đã tồn tại trong nhóm"
                    }
                }
                if(res?.studentId !==""){
                    return {
                        status: 200,
                        data: res
                    }
                }
            });
    },

    DeleteMember: (params) => {
        const url = "/GroupMembers";
        return axiosClient.delete(url, {
            data:{
                groupId: params.groupId,
                studentId: params.studentId
            }})
            .then((res) => {
                if(res ==="You can not delete yourself out of your group leaded"){
                    return {
                        status: 400,
                        error: "Bạn không thể xóa chính bạn ra khỏi nhóm"
                    }
                }
                else if(res === "You can not delete member in group, have been assigned topic"){
                    return {
                        status: 400,
                        error: "Nhóm đã thực hiện đề tài không thể xóa thành viên"
                    }
                }
                else if(res?.statusCode === 200){
                    return {
                        status: 200,
                        data: "Xóa thành công"
                    }
                }
                else{
                    return {
                        status: 400,
                        data: "Xóa thất bại"
                    }
                }
            });
    },
}

export default GroupMemberApi; 