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
import "./TopicForStudent.css"
import TopicListForStudent from "./TopicListForStudent";

export default function TopicForStudent() {

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
                <div className="student_data_table">
                    <TopicListForStudent rows={topics}></TopicListForStudent>
                </div>
            </div>
        </>
    );
}