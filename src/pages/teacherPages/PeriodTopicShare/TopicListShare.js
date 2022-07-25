import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    Snackbar
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoDisturbSharpIcon from '@mui/icons-material/DoDisturbSharp';
import PendingIcon from "@mui/icons-material/Pending";
import "./PeriodTopicShare.css";
import PeriodTopicDetailShare from "./PeriodTopicDetailShare";

export default function TopicListShare({ rows, teachers }) {

    useEffect(() => {
        InitTopicList();
    }, [rows]);

    const [topics, setTopics] = useState([]);
    const [selectedPeriodTopic, setSelectedPeriodTopic] = useState("");

    const [errorText, setErrorText] = useState("");

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openDetailModal, setOpenDetailModal] = useState(false);

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
        setErrorText("");
    }

    const handleOpenDetailModal = () => {
        setOpenDetailModal(true);
        setErrorText("");
    }

    const handleCloseDetailModal = () => {
        setSelectedPeriodTopic("");
        setOpenDetailModal(false);
    }

    const handleDetailTopic = (e, params) => {
        setSelectedPeriodTopic(params.row.idHiden);
        handleOpenDetailModal();
    }

    

    function InitTopicList() {
        let data = [];
        rows.forEach((r, index) => {
            let d = {
                id: index + 1,
                teacherEmail: r.teacher.email,
                teacherId: r.teacher.id,
                topicName: r.topic.name,
                approval: r.state,
                idHiden: r.id,
                maxRegister: r.maxRegister,
                maxGroupMember: r.maxGroupMember,
                periodId: r.periodId,
                topicId: r.topicId
            }
            data.push(d);
        });
        setTopics(data);
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'teacherEmail',
            headerName: 'Giáo viên',
            width: 200,
        },
        {
            field: 'topicName',
            headerName: 'Tên đề tài',
            width: 300,
        },
        {
            field: "approval",
            headerName: 'Duyệt',
            renderCell: (params) => {
                if (params.row.approval == '1') {
                    return (
                        <PendingIcon
                        color="primary"
                        >  
                        </PendingIcon>
                    )
                }
                else if (params.row.approval == '3') {
                    return (
                        <DoDisturbSharpIcon
                            color="error"
                        ></DoDisturbSharpIcon>
                    );
                }
                else if (params.row.approval == '2') {
                    return (
                        <CheckCircleIcon
                            color="success"
                        ></CheckCircleIcon>
                    );
                }
            }
        },
        {
            field: "Detail",
            headerName: 'Chi tiết',
            renderCell: (params) => {
                return (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={(event) => {
                            handleDetailTopic(event, params);
                        }}
                    >
                        Chi tiết
                    </Button>
                );
            }
        }
    ];

    return (
        <>
            <Box sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={topics}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                />
            </Box>

            <Dialog
                fullWidth={true}
                maxWidth={'md'}
                open={openDetailModal}
                onClose={handleCloseDetailModal}>
                <PeriodTopicDetailShare id={selectedPeriodTopic}></PeriodTopicDetailShare>
            </Dialog>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                message={errorText}
            />
        </>
    );
}