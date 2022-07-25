import React, { useEffect, useState, useRef } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
    Snackbar
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GroupStudentApi from "../../../api/GroupStudentApi"
import PeriodTopicStudentApi from "../../../api/PeriodTopicStudentApi"
import PTSDetail from "./PTSDetail";

export default function PTSListForTecher({ rows, period }) {

    useEffect(() => {
        InitPtsList();
    }, [rows]);

    const [pts, setPts] = useState([]);
    const [selectedPTS, setSelectedPTS] = useState("");

    const [errorText, setErrorText] = useState("");

    // Modal
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [openApprovalModal, setOpenApprovalModal] = useState(false);

   
    const handleOpenApprovalModal = () => {
        setOpenApprovalModal(true);
    }

    const handleCloseApprovalModal = () => {
        setOpenApprovalModal(false);
    }

    const handleOpenDetailModal = () => {
        setOpenDetailModal(true);
    }

    const handleCloseDetailModal = () => {
        setOpenDetailModal(false);
    }

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
        setErrorText("");
    }
    function InitPtsList() {
        let data = [];
        let index = 1;
        rows.forEach((r) => {
            let d = {
                id: index,
                topicName: r.periodTopic.topic.name,
                approval: r.approval,
                idHidden: r.id,
                groupName: r.groupStudent.name
            }
            data.push(d);
            index = index + 1;
        });
        setPts(data);
    };


    const handlePreDetail = (e, params) => {
        setSelectedPTS(params.row.idHidden);
        handleOpenDetailModal();
    }
    const handlePreApproval = (e, params) => {
        setSelectedPTS(params.row.idHidden);
        handleOpenApprovalModal();
    }

    async function handleApproval(){
        let res = await PeriodTopicStudentApi.ApprovalPTS({id:selectedPTS});
        if(res.status === 200){
            pts.forEach((e) => {
                if(e.idHidden === selectedPTS){
                    e.approval = true;
                }
            });
            handleCloseApprovalModal();
        }
        else{
            setErrorText(res.error);
            setOpenSnackbar(true);
        }
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'topicName',
            headerName: 'Tên đề tài',
            width: 300,
        },
        {
            field: 'groupName',
            headerName: 'Tên nhóm',
            width: 200,
        },
        {
            field: "State",
            headerName: 'Trạng thái',
            renderCell: (params) => {
                if (params.row.approval) {
                    return (
                        <CheckCircleIcon
                            color="success">
                        </CheckCircleIcon>
                    );
                } else {
                    return (
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={(event) => {
                                handlePreApproval(event, params);
                            }}
                        >
                            Duyệt
                        </Button>
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
                            handlePreDetail(event, params);
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
                    rows={pts}
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
                <PTSDetail id={selectedPTS}></PTSDetail>
            </Dialog>

            <Dialog open={openApprovalModal} onClose={handleCloseApprovalModal}>
                <DialogTitle >Bạn muốn duyệt đăng kí này</DialogTitle>
                <DialogActions>
                    <Button color="primary" onClick={handleApproval}>Có</Button>
                    <Button color="error" onClick={handleCloseApprovalModal}>Thoát</Button>
                </DialogActions>
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