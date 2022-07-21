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
    TextareaAutosize
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import "./Topic.css"
import TopicDetail from "./TopicDetail";
import TopicApi from "../../../api/TopicApi";


export default function TopicList({ rows }) {

    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState("");

    // Modal
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    useEffect(() => {
        InitList();
    }, [rows]);

    const [name, setName] = useState("");
    const [major, setMajor] = useState("");
    const [description, setDescription] = useState("");

    const [errorText, setErrorText] = useState("");

    const handleChangeName = (e) => {
        setName(e.target.value);
    }

    const handleChangeDescription = (e) => {
        setDescription(e.target.value);
    };

    const handleChangeMajor = (e) => {
        setMajor(e.target.value);
    };

    const handleOpenDetailModal = () => {
        setErrorText("");
        setOpenDetailModal(true);
    }

    const handleCloseDetailModal = () => {
        setOpenDetailModal(false);
    }

    const handleOpenUpdateModal = () => {
        setErrorText("");
        setOpenUpdateModal(true);
    }

    const handleCloseUpdateModal = () => {
        setOpenUpdateModal(false);
    }

    const handleOpenDeleteModal = () => {
        setErrorText("");
        setOpenDeleteModal(true);
    }

    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
    }


    function InitList() {
        let data = [];
        rows.forEach((r, index) => {
            let d = {
                id: index + 1,
                name: r.name,
                major: r.major,
                description: r.description,
                idHidden: r.id
            }
            data.push(d);
        });
        setTopics(data);
    }

    async function InitTopic(id) {
        let res = await TopicApi.GetTopicDetail({ id: id });
        if (res.status === 200) {
            setName(res?.data?.name);
            setDescription(res?.data?.description);
            setMajor(res?.data?.major);
        }
    }

    function handleDetailTopic(event, params) {
        setSelectedTopic(params.row.idHidden);
        handleOpenDetailModal();
    }

    function handleUpdateTopic(e, params) {
        setSelectedTopic(params.row.idHidden);
        InitTopic(params.row.idHidden)
        handleOpenUpdateModal();
    }

    function handleDeleteTopic(e, params) {
        setSelectedTopic(params.row.idHidden);
        handleOpenDeleteModal();
    }

    async function handleUpdate() {
        let data = {
            id: selectedTopic,
            name: name,
            major: major,
            description: description
        }
        let res = await TopicApi.UpdateTopic(data);
        if (res.status === 200) {
            topics.forEach((r, index) => {
                if (r.idHidden === data.id) {
                    r.name = res.data.name;
                    r.major = res.data.major;
                    r.description = res.data.description;
                }
            });

            handleCloseUpdateModal();
        }
        else {
            setErrorText(res.error);
        }
    }

    async function handleDelete(){
        let res = await TopicApi.DeleteTopic({ id: selectedTopic});
        if(res.status === 200){
            
            setTopics(topics.filter(function(p){
                return p.idHidden !== selectedTopic;
            }));
            setErrorText("");
            handleCloseDeleteModal();
        }
        else{
            setErrorText(res.error);
        }
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'name',
            headerName: 'Tên đề tài',
            width: 200,
        },
        {
            field: 'major',
            headerName: 'Chuyên ngành',
            width: 300,
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
        },
        {
            field: "Edit",
            headerName: 'Chỉnh sửa',
            renderCell: (params) => {

                return (
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={(event) => {
                            handleUpdateTopic(event, params);
                        }}
                    >
                        Sửa
                    </Button>
                );
            }
        },
        {
            field: "Delete",
            headerName: "Xóa",
            width: 100,
            renderCell: (params) => {

                return (
                    <Button
                        variant="contained"
                        color="error"
                        onClick={(event) => {
                            handleDeleteTopic(event, params);
                        }}
                    >Xóa
                    </Button>
                );
            }
        }
    ];

    return (
        <>
            <Box sx={{ height: 500, width: '100%' }}>
                <DataGrid
                    rows={topics}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                />
            </Box>

            <Dialog
                open={openDetailModal}
                onClose={handleCloseDetailModal}
                fullWidth={true}
                maxWidth={'md'}
            >
                <TopicDetail id={selectedTopic}  ></TopicDetail>
            </Dialog>

            <Dialog
                fullWidth={true}
                maxWidth={'sm'}
                open={openUpdateModal}
                onClose={handleCloseUpdateModal}
            >
                <DialogTitle>Thêm đề tài mới</DialogTitle>
                <DialogContent>
                    <Grid item xs={9}>
                        <Typography ml={1} mt={2.5}>
                            Tên đề tài
                        </Typography>
                        <TextField
                            required
                            label="Tên đề tài"
                            fullWidth
                            autoComplete="off"
                            name="name"
                            onChange={handleChangeName}
                            value={name}
                        />
                    </Grid>
                    <Grid item xs={9}>
                        <Typography ml={1} mt={2.5}>
                            Nhóm ngành
                        </Typography>
                        <TextField
                            required
                            label="Ngành"
                            fullWidth
                            autoComplete="off"
                            name="name"
                            onChange={handleChangeMajor}
                            value={major}
                        />
                    </Grid>
                    <Grid item xs={9}>
                        <Typography ml={1} mt={2.5}>
                            Mô tả
                        </Typography>
                        <TextareaAutosize
                            minRows={3}
                            style={{ width: 500 }}
                            onChange={handleChangeDescription}
                            value={description}
                        />
                    </Grid>
                </DialogContent>
                {errorText ? <Box className="error_add_period" sx={{ color: "error.main" }}>{errorText}</Box> : null}
                <DialogActions>
                    <Button onClick={handleCloseUpdateModal} >Hủy</Button>
                    <Button onClick={handleUpdate}>Lưu</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDeleteModal} onClose={handleCloseDeleteModal}>
                <DialogTitle >Bạn có muốn xóa đề tài ra khỏi danh sách</DialogTitle>
                {errorText ? <Box className="error_add_period" sx={{ color: "error.main" }}>{errorText}</Box> : null}
                <DialogActions>
                    <Button color="primary" onClick={handleCloseDeleteModal}>Không</Button>
                    <Button color="error" onClick={handleDelete}>Có</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}