import axiosClient from "./axiosClient";

const ReportApi = {
    GetReportInPeriod: (params) => {
        const url = "/reports/ReportPeriods/"+params.id;
        return axiosClient.get(url)
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
                        error: "Lỗi lấy danh sách report"
                    }
                }
            });
    },
    DownReportInPeriod: (params) => {
        const url = "/reports/ExportReportPeriods/"+params.id;
        return axiosClient.get(url)
        .then((res) => {
            if (res.status === 200) {
                return {
                    status: 200
                }
            }
        });
    },
}

export default ReportApi;