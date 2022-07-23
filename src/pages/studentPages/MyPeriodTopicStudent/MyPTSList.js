import React, { useEffect, useState } from "react";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
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
import RichTextEditor from "../PeriodTopicStudent/RichTextEditor";
import PeriodTopicStudentApi from "../../../api/PeriodTopicStudentApi";
import MyPTSDetail from "./MyPTSDetail";

export default function MyPTSList({ rows }) {

    const [topics, setTopics] = useState([]);
    const [selectedPTS, setSelectedPTS] = useState("");

    useEffect(() => {
        InitTopicList();
    }, [rows]);

    // Modal
    const [errorText, setErrorText] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openDetailModal, setOpenDetailModal] = useState(false);

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    }

    const handleOpenDetailModal = () => {
        setOpenDetailModal(true);
        setErrorText("");
    }

    const handleCloseDetailModal = () => {
        setOpenDetailModal(false);
    }

    const handleOpenUpdateModal = () => {
        setOpenUpdateModal(true);
        setErrorText("");
    }

    const handleCloseUpdateModal = () => {
        setOpenUpdateModal(false);
    }

    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
    }

    const handleOpenDeleteModal = () => {
        setOpenDeleteModal(true);
        setErrorText("");
    }

    //Planing
    const [planing, setPlaning] = useState("");
    const getPlaning = (value) => {
        setPlaning(value);
    };

    function InitTopicList() {
        let data = [];
        let index = 1;
        rows.forEach((r) => {
            if (r.state != '3') {
                let d = {
                    id: index,
                    teacherEmail: r.periodTopic.teacher.email,
                    teacherId: r.periodTopic.teacher.id,
                    topicName: r.periodTopic.topic.name,
                    approval: r.approval,
                    idHiden: r.id,
                    maxRegister: r.maxRegister,
                    maxGroupMember: r.maxGroupMember,
                    periodId: r.periodId,
                    topicId: r.topicId,
                    planning: r.planning,
                }
                data.push(d);
                index = index + 1;
            }
        });
        setTopics(data);
    };

    const handlePreUpdate = (e, params) => {
        setPlaning(params.row.planning);
        setSelectedPTS(params.row.idHiden);
        handleOpenUpdateModal();
    }

    const handlePreDelete = (e, params) => {
        setSelectedPTS(params.row.idHiden);
        handleOpenDeleteModal();
    }

    const handlePreDetail = (e, params) => {
        setSelectedPTS(params.row.idHiden);
        handleOpenDetailModal();
    }


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
                        <PendingIcon
                            color="primary">

                        </PendingIcon>
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
        },
        {
            field: "Edit",
            headerName: 'Kế hoạch thực hiện',
            renderCell: (params) => {
                if (!params.row.approval) {
                    return (
                        <Button
                            variant="contained"
                            color="warning"
                            onClick={(event) => {
                                handlePreUpdate(event, params);
                            }}
                        >
                            Sửa
                        </Button>
                    );
                }
            }
        },
        {
            field: "Delete",
            headerName: 'Xóa',
            renderCell: (params) => {
                if (!params.row.approval) {
                    return (
                        <Button
                            variant="contained"
                            color="error"
                            onClick={(event) => {
                                handlePreDelete(event, params);
                            }}
                        >
                            Xóa
                        </Button>
                    );
                }
            }
        }
    ];

    async function handleUpdate() {
        let data = {
            id: selectedPTS,
            planning: planing
        };
        let res = await PeriodTopicStudentApi.UpdatePTS(data);
        if (res.status === 200) {
            topics.forEach((t) => {
                if (t.idHiden === selectedPTS) {
                    t.planning = planing;
                }
            });
            handleCloseUpdateModal();
            setErrorText("Cập nhật kế hoạch thực hiện thành công");
            setOpenSnackbar(true);
        } else if (res.status === 400) {
            setErrorText(res.error);
        }
    }

    async function handleDelete() {
        let res = await PeriodTopicStudentApi.DeletePTS({ id: selectedPTS });
        if (res.status === 200) {
            setTopics(topics.filter(function (t) {
                return t.idHiden !== selectedPTS
            }));
            handleCloseDeleteModal();
        }
        else {
            setErrorText(res.error);
        }
    }

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
                maxWidth={'lg'}
                open={openUpdateModal}
                onClose={handleCloseUpdateModal}>
                <DialogTitle>Sửa bảng kế hoạch</DialogTitle>
                <DialogContent>
                    <RichTextEditor initialValue={planing} getValue={getPlaning} />
                </DialogContent>
                {errorText ? <Box className="error_add_period" sx={{ color: "error.main" }}>{errorText}</Box> : null}
                <DialogActions>
                    <Button onClick={handleCloseUpdateModal}>Hủy</Button>
                    <Button onClick={handleUpdate} >Lưu</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDeleteModal} onClose={handleCloseDeleteModal}>
                <DialogTitle >Bạn có muốn xóa đăng kí danh sách</DialogTitle>
                <DialogTitle >Đề tài của bạn sẽ được giữ lại cho các sinh viên khác</DialogTitle>
                <DialogActions>
                    <Button color="primary" onClick={handleCloseDeleteModal}>Không</Button>
                    <Button color="error" onClick={handleDelete}>Có</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                fullWidth={true}
                maxWidth={'md'}
                open={openDetailModal}
                onClose={handleCloseDetailModal}>
                <MyPTSDetail id={selectedPTS}></MyPTSDetail>
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