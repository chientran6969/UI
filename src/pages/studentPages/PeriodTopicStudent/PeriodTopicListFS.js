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
import PendingIcon from '@mui/icons-material/Pending';
import "./PeriodTopicStudent.css";
import GroupStudentApi from "../../../api/GroupStudentApi"
import PeriodTopicStudentApi from "../../../api/PeriodTopicStudentApi"
import RichTextEditor from "./RichTextEditor";

export default function PeriodTopicListFS({ rows, teachers, period }) {

    useEffect(() => {
        InitTopicList();
    }, [rows]);

    const [topics, setTopics] = useState([]);
    const [myGroup, setMyGroup] = useState("");
    const [selectedPeriodTopic, setSelectedPeriodTopic] = useState("");

    const [errorText, setErrorText] = useState("");

    // Modal
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openRegisterModal, setOpenRegisterModal] = useState(false);

    //Planing
    const [planing, setPlaning] = useState("");
    const getPlaning = (value) => {
        setPlaning(value);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
        setErrorText("");
    }

    const handleOpenRegisterModal = () => {

        setOpenRegisterModal(true);
        setErrorText("");

    }

    const handleCloseRegisterModal = () => {
        setOpenRegisterModal(false);
        setSelectedPeriodTopic("");
    }

    function InitTopicList() {
        let data = [];
        let index = 1;
        rows.forEach((r) => {
            if (r.state != '3') {
                let d = {
                    id: index,
                    teacherEmail: r.teacher.email,
                    teacherId: r.teacher.id,
                    topicName: r.topic.name,
                    approval: r.state,
                    idHiden: r.id,
                    maxRegister: r.maxRegister,
                    maxGroupMember: r.maxGroupMember,
                    periodId: r.periodId,
                    topicId: r.topicId,
                    registered: r.periodTopicStudents.length + "/" + r.maxRegister,
                    periodTopicStudents: r.periodTopicStudents
                }
                data.push(d);
                index = index + 1;
            }
        });
        setTopics(data);
    };
    
    const handlePreRegister = (e, params) => {
        setSelectedPeriodTopic(params.row.idHiden);
        checkInitGroup(params.row);
    }

    async function checkInitGroup(value) {
        let res = await GroupStudentApi.GetMyGroupInPeriod({ periodId: period });
        let myOwnPts = await PeriodTopicStudentApi.GetOwnPTSInPeriod({ periodId: period });

        if (res.status === 200) {
            let check = false;
            value.periodTopicStudents.forEach((p) => {
                if (p.groupId === myOwnPts.data.groupId) {
                    check = true;
                }
            });
            if (check) {
                setErrorText("Bạn đã đăng kí đề tài này");
                setOpenSnackbar(true);
            }
            else {
                handleOpenRegisterModal();
            }
            setMyGroup(res.data);
        }
        else {
            setMyGroup("");
            setErrorText("Bạn chưa tạo nhóm đăng kí trong kì này");
            setOpenSnackbar(true);
        }
    }

    async function handleRegister() {
        let data = {
            periodTopicId: selectedPeriodTopic,
            groupId: myGroup.id,
            planning: planing
        }

        let res = await PeriodTopicStudentApi.AddPTS(data);
        if (res.status === 200) {
            topics.forEach((t) => {
                if (t.idHiden === selectedPeriodTopic) {
                    t.registered = t.periodTopicStudents.length + 1 + "/" + t.maxRegister;
                    t.periodTopicStudents = [
                        {
                            groupId: data.groupId
                        }
                    ]
                }
            });
            handleCloseRegisterModal();
        }
        else if (res.status === 400) {
            setErrorText(res.error);
        }
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
            field: 'registered',
            headerName: 'Số lượng',
            width: 100,
        },
        {
            field: "State",
            headerName: 'Trạng thái',
            renderCell: (params) => {
                if (params.row.approval == '2') {
                    return (
                        <CheckCircleIcon
                            color="success">

                        </CheckCircleIcon>
                    );
                } else if (params.row.approval == '1') {
                    return (
                        <PendingIcon
                            color="primary">

                        </PendingIcon>
                    );
                }
            }
        },
        {
            field: "Register",
            headerName: 'Đăng kí',
            renderCell: (params) => {
                if (params.row.approval == '2') {
                    return (
                        <Button
                            variant="outlined"
                            color="warning"
                            onClick={(event) => {
                                handlePreRegister(event, params);
                            }}
                        >
                            Đăng kí
                        </Button>
                    );
                }
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
                maxWidth={'lg'}
                open={openRegisterModal}
                onClose={handleCloseRegisterModal}>
                <DialogTitle>Đăng kí</DialogTitle>
                <DialogContent>
                    <RichTextEditor initialValue="" getValue={getPlaning} />
                </DialogContent>
                {errorText ? <Box className="error_add_period" sx={{ color: "error.main" }}>{errorText}</Box> : null}
                <DialogActions>
                    <Button onClick={handleCloseRegisterModal}>Hủy</Button>
                    <Button onClick={handleRegister} >Lưu</Button>
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