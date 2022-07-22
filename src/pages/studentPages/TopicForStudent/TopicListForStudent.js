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
import "./TopicForStudent.css"
import TopicDetailForStudent from "./TopicDetailForStudent";
import TopicApi from "../../../api/TopicApi";


export default function TopicListForStudent({ rows }) {

    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState("");

    // Modal
    const [openDetailModal, setOpenDetailModal] = useState(false);

    useEffect(() => {
        InitList();
    }, [rows]);

    const handleOpenDetailModal = () => {
        setOpenDetailModal(true);
    }

    const handleCloseDetailModal = () => {
        setOpenDetailModal(false);
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

    function handleDetailTopic(event, params) {
        setSelectedTopic(params.row.idHidden);
        handleOpenDetailModal();
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
                <TopicDetailForStudent id={selectedTopic}  ></TopicDetailForStudent>
            </Dialog>
        </>
    );
}