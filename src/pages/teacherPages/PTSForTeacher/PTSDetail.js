import React, { useEffect, useState } from "react";
import {
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";
import PeriodTopicStudentApi from "../../../api/PeriodTopicStudentApi";

export default function PTSDetail({ id }) {

    const [ptsDetail, setPtsDetail] = useState();

    useEffect(() => {
        InitTopic();
    }, [id]);

    async function InitTopic() {
        let res = await PeriodTopicStudentApi.GetPTSById({ id: id });
        if (res.status === 200) {
            setPtsDetail(res.data);
            console.log(res.data);
        }
    }

    return (
        <>
            <DialogTitle >Thông tin chi tiết</DialogTitle>
            <DialogContent>
                <Typography ml={1} mt={2.5}>
                    Tên đề tài: {ptsDetail?.periodTopic?.topic?.name}
                </Typography>
                <Typography ml={1} mt={2.5}>
                    Nhóm: {ptsDetail?.groupStudent?.name}
                </Typography>
                {ptsDetail?.groupStudent?.students.map((option) => (
                    <Typography ml={1} mt={2.5} key={option.studentId}>{option.studentId}</Typography>
                ))}
                <Typography ml={1} mt={2.5}>
                    Kế hoạch thực hiện:
                </Typography>
                <Typography ml={1} mt={2.5}>
                    <div dangerouslySetInnerHTML={{ __html: ptsDetail?.planning }}>
                    </div>
                </Typography>

            </DialogContent>
        </>
    );
}