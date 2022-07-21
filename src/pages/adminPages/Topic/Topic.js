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
import TopicApi from "../../../api/TopicApi";
import "./Topic.css"
import TopicList from "./TopicList";

export default function Topic() {

    const [topics, setTopics] = useState([]);

    const [name, setName] = useState("");
    const [major, setMajor] = useState("");
    const [description, setDescription] = useState("");

    const [errorText, setErrorText] = useState("");




    useEffect(() => {
        InitTopics();
    },[]);


    const handleChangeName = (e) => {
        setName(e.target.value);
    }

    const handleChangeDescription = (e) => {
        setDescription(e.target.value);
    };

    const handleChangeMajor = (e) => {
        setMajor(e.target.value);
    };   

    // Modal
    const [openAddModal, setOpenAddModal] = useState(false);

    const handleOpenAddModal = () => {
        setName("");
        setDescription("");
        setMajor("");
        setErrorText("");
        setOpenAddModal(true);
    }

    const handleCloseAddModal = () => {
        setOpenAddModal(false);
    }

    async function InitTopics() {
        let res = await TopicApi.GetTopicList();
        if(res.status === 200){
            setTopics(res.data);
        }
    }

    async function handleAdd(){
        let data = {
            name: name,
            major: major,
            description: description
        }

        if(name === "" || major === "" || description === ""){
            setErrorText("Nhập thiếu thông tin");
        }
        else{
            let res = await TopicApi.AddTopic(data);
            if(res.status === 200){
                handleCloseAddModal();
                setErrorText("");
                InitTopics();
            }
            else{
                setErrorText(res.error);
            }
        }
    }

    return (
        <>
            <div className="mb-3">
                <div className="addzone">
                    <Button onClick={handleOpenAddModal} className="btn_add_student" variant="outlined" color="primary">Thêm đề tài mới</Button>
                </div>
                <div className="student_data_table">
                    <TopicList rows={topics}></TopicList>
                </div>
            </div>

            <Dialog
                fullWidth={true}
                maxWidth={'sm'}
                open={openAddModal}
                onClose={handleCloseAddModal}
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
                        />
                    </Grid>
                </DialogContent>
                {errorText ? <Box className="error_add_period" sx={{ color: "error.main" }}>{errorText}</Box> : null}
                <DialogActions>
                    <Button onClick={handleCloseAddModal} >Hủy</Button>
                    <Button onClick={handleAdd}>Thêm</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}