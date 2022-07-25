import React, { useEffect, useState } from "react";
import "./PeriodTopicShare.css";
import PeriodTopicApi from "../../../api/PeriodTopicApi";
import {
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";

export default function PeriodTopicDetailShare({ id }) {

    const [topicDetail, setTopicDetail] = useState();

    useEffect(() => {
        InitTopic();
    }, [id]);

    async function InitTopic() {
        let res = await PeriodTopicApi.GetPeriodTopicDetail({ id: id });
        if (res.status === 200) {
            setTopicDetail(res.data);
        }
    }

    return (
        <>
            <DialogTitle >Thông tin chi tiết</DialogTitle>
            <DialogContent>
                <Typography ml={1} mt={2.5}>
                    Tên đề tài:
                    {topicDetail?.topic?.name}
                </Typography>
                <Typography ml={1} mt={2.5}>
                    Đợt đăng kí: {topicDetail?.period?.name}
                </Typography>
                <Typography ml={1} mt={2.5}>
                    Giáo viên phụ trách: {topicDetail?.teacher?.email}
                </Typography>
                <Typography ml={1} mt={2.5}>
                    Số lượng đăng kí tối đa: {topicDetail?.maxRegister}
                </Typography>
                <Typography ml={1} mt={2.5}>
                    Số lượng thành viên tối đa mỗi nhóm: {topicDetail?.maxGroupMember}
                </Typography>
                <Typography ml={1} mt={2.5}>
                    Trạng thái: {(topicDetail?.state=='1'?"Chờ xét duyệt":(topicDetail?.state=='2'?"Đã được duyệt":"Đã bị từ chối"))}
                </Typography>
                <Typography ml={1} mt={2.5}>
                    Số lượng đã đăng kí: {topicDetail?.periodTopicStudents?.length}/{topicDetail?.maxRegister}
                </Typography>
                <Typography ml={1} mt={2.5}>
                    Mô tả:
                </Typography>
                <Typography ml={1} mt={2.5}>
                    {topicDetail?.topic?.description}
                </Typography>
            </DialogContent>
        </>
    );
}