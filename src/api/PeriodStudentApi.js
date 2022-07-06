import axiosClient from "./axiosClient";

const PeriodStudentApi = {
    GetListStudentByPeriod: (params) => {
        const url = "/PeriodStudents";
        return axiosClient.get(url, {
                params
            })
            .then((res) => {
                return {
                    data: res,
                    length: res.length
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

    UpdatePeriodStudent: (params) => {
        const url = "/PeriodStudents"
        return axiosClient.put(url, params)
            .then((res) => {
                if (res === "New Student Id have Exist") {
                    return {
                        status: 400,
                        error: "MSSV đã tồn tại trong danh sách"
                    }
                } else if (res === "Student Id not found") {
                    return {
                        status: 400,
                        error: "MSSV cần chỉnh sửa không tồn tại"
                    }
                }
                return {
                    status: 200,
                    data: res.studentId
                }
            });
    },

    AddPeriodStudent: (params) => {
        const url = "/PeriodStudents";
        return axiosClient.post(url, params)
            .then((res) => {
                if (res === "Student ID is exist") {
                    return {
                        status: 400,
                        error: "MSSV đã tồn tại trong danh sách"
                    }
                } else if (res.statusCode === 201) {
                    return {
                        status: 201
                    }
                }
            });
    },
    AddPeriodStudentByCsv: (params) => {
        const data = new FormData();
        data.append('File', params.File);
        data.append('PeriodId', params.PeriodId);

        const url = "/PeriodStudents/import";
        return axiosClient.post(url, data)
            .then((res) => {
                if (res.length && res.length > 0) {
                    return {
                        status: 200,
                        data: res
                    }
                } else {
                    if (res.error && res.error === "Transaction has been completed with 0 row(s) affected.") {
                        return {
                            status: 400,
                            error: "Tất cả các record được thêm đã tồn tại trong danh sách"
                        }
                    } else {
                        return {
                            status: 400,
                            error: "Thêm thất bại hoặc file không đúng template"
                        }
                    }
                }
            });
    },
    DeletePeriodStudent: (params) => {
        const url = "/PeriodStudents";
        return axiosClient.delete(url, {
            data: {
                periodId: params.periodId,
                studentId: params.studentId
            }
        }).then((res) => {
            if (res.statusCode) {
                if (res.statusCode === 200) {
                    return {
                        status: 200,
                        message: "Delete successfully"
                    }
                }
            } else {
                return {
                    status: 404,
                    message: "Delete request failed"
                }
            }
        });
    }
};

export default PeriodStudentApi;