import React, { useEffect, useState } from "react";
import "./Topic.css";
import TopicApi from "../../../api/TopicApi";
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

export default function TopicDetail({ id }) {

    const [topic, setTopic] = useState("");


    useEffect(() => {
        InitTopic();
    }, []);

    async function InitTopic() {
        let res = await TopicApi.GetTopicDetail({ id: id });
        if (res.status === 200) {
            setTopic(res.data);
        }
    }

    return (
        <>

            <DialogTitle >Thông tin chi tiết</DialogTitle>
            <DialogContent>
                <Typography ml={1} mt={2.5}>
                    Tên đề tài:
                    {topic?.name}
                </Typography>
                <Typography ml={1} mt={2.5}>
                    Chuyên ngành:
                    {topic?.major}
                </Typography>
                <Typography ml={1} mt={2.5}>
                    Mô tả:
                </Typography>
                <Typography ml={1} mt={2.5}>
                    {topic?.description}
                </Typography>
            </DialogContent>
        </>
    );
}