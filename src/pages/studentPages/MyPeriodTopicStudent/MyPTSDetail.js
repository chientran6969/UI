import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    TextField,
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
    Grid,
    Typography,
    Input,
    Snackbar
} from "@mui/material";
import Parser from 'html-react-parser';
import PeriodTopicStudentApi from "../../../api/PeriodTopicStudentApi";

export default function MyPTSDetail({ id }) {

    const [PTSDetail, setPTSDetail] = useState("");

    useEffect(() => {
        InitPTS();
    }, [id]);

    async function InitPTS() {
        let res = await PeriodTopicStudentApi.GetPTSById({ id: id });
        if (res.status === 200) {
            setPTSDetail(res.data);
            console.log(res.data);
        }
    }

    return (
        <>
            <DialogTitle >Thông tin chi tiết</DialogTitle>
            <DialogContent>
                <Typography>
                    Mô tả đề tài:
                </Typography>
                <Typography ml={1} mt={2.5}>
                    <div dangerouslySetInnerHTML={{ __html: PTSDetail?.planning }}>
                    </div>
                </Typography>
            </DialogContent>
        </>
    );
}