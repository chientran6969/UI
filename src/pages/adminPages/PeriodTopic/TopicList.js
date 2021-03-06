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
import { DataGrid } from "@mui/x-data-grid";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoDisturbSharpIcon from '@mui/icons-material/DoDisturbSharp';
import "./PeriodTopic.css";
import PeriodTopicApi from "../../../api/PeriodTopicApi";
import PeriodTopicDetail from "./PeriodTopicDetail";

export default function TopicList({ rows, teachers }) {

    useEffect(() => {
        setTeacherList(teachers);
        InitTopicList();
    }, [rows]);

    const [topics, setTopics] = useState([]);
    const [selectedPeriodTopic, setSelectedPeriodTopic] = useState("");
    const [selectedTeacher, setSelectedTeacher] = useState("");
    const [teacherList, setTeacherList] = useState([]);

    const [errorText, setErrorText] = useState("");


    const [selectedMaxMember, setSelectedMaxMember] = useState();
    const [selectedMaxRegister, setSelectedMaxRegister] = useState();
    const [selectedPeriodId, setSelectedPeriodId] = useState("");
    const [selectedTopicId, setSelectedTopicId] = useState("");

    // Modal
    const [openApprovalModal, setOpenApprovalModal] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);



    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
        setErrorText("");
    }

    const handleOpenDeleteModal = () => {
        setOpenDeleteModal(true);
        setErrorText("");
    }

    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
        setSelectedPeriodTopic("");
    }

    const handleOpenApprovalModal = () => {
        setOpenApprovalModal(true);
        setErrorText("");
    }

    const handleCloseApprovalModal = () => {
        setOpenApprovalModal(false);
        setSelectedPeriodTopic("");
    }

    const handleOpenUpdateModal = () => {
        setErrorText("");
        setOpenUpdateModal(true);
    }

    const handleCloseUpdateModal = () => {
        setOpenUpdateModal(false);
        setSelectedPeriodTopic("");
    }

    const handleOpenDetailModal = () => {
        setOpenDetailModal(true);
        setErrorText("");
    }

    const handleCloseDetailModal = () => {
        setSelectedPeriodTopic("");
        setOpenDetailModal(false);
    }

    const handleApprovalTopic = (e, params) => {
        setSelectedPeriodTopic(params.row.idHiden);
        handleOpenApprovalModal();
    }

    const handleDeleteTopic = (e, params) => {
        setSelectedPeriodTopic(params.row.idHiden);
        handleOpenDeleteModal();
    }

    const handleDetailTopic = (e, params) => {
        setSelectedPeriodTopic(params.row.idHiden);
        handleOpenDetailModal();
    }

    const handleUpdatePeriodTopic = (e, params) => {
        setSelectedPeriodTopic(params.row.idHiden);
        setSelectedMaxRegister(params.row.maxRegister);
        setSelectedMaxMember(params.row.maxGroupMember);
        setSelectedTeacher(params.row.teacherId);
        setSelectedPeriodId(params.row.periodId);
        setSelectedTopicId(params.row.topicId);
        handleOpenUpdateModal();
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

    const handleChangeMaxRegister = (e) => {
        setSelectedMaxRegister(e.target.value);
    }

    const handleChangeMaxMember = (e) => {
        setSelectedMaxMember(e.target.value);
    }

    function handleAccept() {
        let data = {
            id: selectedPeriodTopic,
            accept: true
        }
        handleResponse(data);
    }

    function handleReject() {
        let data = {
            id: selectedPeriodTopic,
            accept: false
        }
        handleResponse(data);
    }

    async function handleResponse(data) {
        let res = await PeriodTopicApi.ResponsePeriodTopic(data);
        if (res.status === 200) {
            rows.forEach((r, index) => {
                if (r.id === data.id) {
                    r.state = data.accept ? '2' : '3'
                }
            });
            InitTopicList();
            handleCloseApprovalModal();
        }
        else {
            setErrorText(res.error);
            setOpenSnackbar(true);
        }
    }

    const handleChangeTeacher = (event) => {
        if (event.target.value !== "0") {
            setSelectedTeacher(event.target.value);
        }
        else {
            setSelectedTeacher("0");
        }
    };

    async function handleUpdate() {
        if (selectedTeacher === "0") {
            setErrorText("Ch??a nh???p ????? th??ng tin");
        }
        else if (selectedMaxRegister > 10) {
            setErrorText("S??? l?????ng ????ng k?? t???i ??a ph???i nh??? h??n 10");
        }
        else if (selectedMaxMember > 3) {
            setErrorText("S??? l?????ng th??nh vi??n kh??ng ???????c v?????t qu?? 3");
        }
        else if (selectedMaxRegister <= 0
            || selectedMaxMember <= 0) {
            setErrorText("????? t??i t???i ??a v?? s??? l?????ng th??nh vi??n t???i ??a ph???i l???n h??n 0");
        }
        else {
            let data = {
                id: selectedPeriodTopic,
                teacherId: selectedTeacher,
                maxRegister: selectedMaxRegister,
                maxGroupMember: selectedMaxMember,
                periodId: selectedPeriodId,
                topicId: selectedTopicId
            };
            let res = await PeriodTopicApi.UpdatePeriodTopic(data);
            if (res.status === 200) {
                topics.forEach(r => {
                    if (r.idHiden === data.id) {
                        r.teacherEmail = teacherList.filter(t => t.id === data.teacherId)[0].email;
                        r.teacherId = data.teacherId;
                        r.maxGroupMember = data.maxGroupMember;
                        r.maxRegister = data.maxRegister;
                        setSelectedTeacher(data.teacherId);
                    }
                })
                handleCloseUpdateModal();
            }
            else {
                setErrorText(res.error);
            }

        }
    }

    async function handleDelete(){
        let res = await PeriodTopicApi.DeletePeriodTopic({id: selectedPeriodTopic});
        if(res.status === 200){
            setTopics(topics.filter(function(p){
                return p.idHiden !== selectedPeriodTopic;
            }));

            handleCloseDeleteModal();
        }
        else{
            setOpenSnackbar(true);
        }
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'teacherEmail',
            headerName: 'Gi??o vi??n',
            width: 200,
        },
        {
            field: 'topicName',
            headerName: 'T??n ????? t??i',
            width: 300,
        },
        {
            field: "approval",
            headerName: 'Duy???t',
            renderCell: (params) => {
                if (params.row.approval == '1') {
                    return (
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={(event) => {
                                handleApprovalTopic(event, params);
                            }}
                        >
                            Duy???t
                        </Button>
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
            headerName: 'Chi ti???t',
            renderCell: (params) => {
                return (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={(event) => {
                            handleDetailTopic(event, params);
                        }}
                    >
                        Chi ti???t
                    </Button>
                );
            }
        },
        {
            field: "Edit",
            headerName: 'Ch???nh s???a',
            renderCell: (params) => {
                if (params.row.approval == '1') {
                    return (
                        <Button
                            variant="contained"
                            color="warning"
                            onClick={(event) => {
                                handleOpenUpdateModal();
                                handleUpdatePeriodTopic(event, params);
                            }}
                        >
                            S???a
                        </Button>
                    );
                }
            }
        },
        {
            field: "Delete",
            headerName: "X??a",
            width: 100,
            renderCell: (params) => {
                if (params.row.approval == '2') {

                }
                else {
                    return (
                        <Button
                            variant="contained"
                            color="error"
                            onClick={(event) => {
                                handleOpenDeleteModal();
                                handleDeleteTopic(event, params);
                            }}
                        >X??a
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

            <Dialog open={openApprovalModal} onClose={handleCloseApprovalModal}>
                <DialogTitle >B???n ch???p nh???n duy???t ????? t??i n??y</DialogTitle>
                <DialogActions>
                    <Button color="error" onClick={handleReject}>Kh??ng</Button>
                    <Button color="success" onClick={handleAccept}>C??</Button>
                    <Button color="primary" onClick={handleCloseApprovalModal}>Tho??t</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                fullWidth={true}
                maxWidth={'md'}
                open={openDetailModal}
                onClose={handleCloseDetailModal}>
                <PeriodTopicDetail id={selectedPeriodTopic}></PeriodTopicDetail>
            </Dialog>

            <Dialog
                fullWidth={true}
                maxWidth={'sm'}
                open={openUpdateModal}
                onClose={handleCloseUpdateModal}>
                <DialogTitle>Ch???nh s???a</DialogTitle>
                <DialogContent>
                    <Grid item xs={6}>
                        <Typography ml={1} mt={2.5}>
                            S??? l?????ng ????ng k?? t???i ??a
                        </Typography>
                        <Input
                            type="number"
                            required
                            fullWidth
                            autoComplete="off"
                            value={selectedMaxRegister}
                            onChange={handleChangeMaxRegister}
                        ></Input>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography ml={1} mt={2.5}>
                            S??? l?????ng th??nh vi??n t???i ??a trong nh??m ????ng k??
                        </Typography>
                        <Input
                            type="number"
                            required
                            fullWidth
                            autoComplete="off"
                            value={selectedMaxMember}
                            onChange={handleChangeMaxMember}
                        ></Input>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography ml={1} mt={2.5}>
                            Gi??o vi??n h?????ng d???n
                        </Typography>
                        <div className="select_teacher">
                            <select value={selectedTeacher} className="format" id="format" onChange={handleChangeTeacher}>
                                {teacherList.map((option) => (
                                    <option key={option.id} value={option.id}>{option.email}</option>
                                ))}
                            </select>
                        </div>
                    </Grid>
                </DialogContent>
                {errorText ? <Box className="error_add_period" sx={{ color: "error.main" }}>{errorText}</Box> : null}
                <DialogActions>
                    <Button onClick={handleCloseUpdateModal}>H???y</Button>
                    <Button onClick={handleUpdate} >L??u</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDeleteModal} onClose={handleCloseDeleteModal}>
                <DialogTitle >B???n c?? mu???n x??a ?????t ????? t??i ra kh???i danh s??ch</DialogTitle>
                <DialogActions>
                    <Button color="primary" onClick={handleCloseDeleteModal}>Kh??ng</Button>
                    <Button color="error" onClick={handleDelete}>C??</Button>
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