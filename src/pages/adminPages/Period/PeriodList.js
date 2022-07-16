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
    Input
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import PeriodApi from "../../../api/PeriodApi";
import "./Period.css"
export default function PeriodList({ rows }) {
    
    const [listPeriods, setListPeriods] = useState([]); // list in data grid

    const [curentPeriods, setCurentPeriods] = useState("");

    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    
    const [name, setName] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [maxTopic, setMaxTopic] = useState(0);

    
    // Error
    const [errorText, setErrorText] = useState("");

    // OnChange Field
    function OnChangeName(event) {
        setName(event.target.value);
    }

    function OnChangeStart(event) {
        setStart(event.target.value);
    };

    function OnChangeEnd(event) {
        setEnd(event.target.value);
    };

    function OnChangeMaxTopic(event) {
        setMaxTopic(event.target.value);
    };

    const handleOpenDeleteModal = () => {
        setOpenDeleteModal(true);
        setErrorText("");
    };

    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
        setCurentPeriods("");
    };

    const handleOpenUpdateModal = () => {
        setOpenUpdateModal(true);
        setErrorText("");
    };

    const handleCloseUpdateModal = () => {
        setOpenUpdateModal(false);
    };

    useEffect(() => {
        InitPeriodList();
    },[rows]);

    function InitPeriodList(){
        let list = [];
        rows.forEach((p, index) => {
            let newP = {
                id: index + 1,
                Name: p.name,
                Start: formatDate(p.start),
                End: formatDate(p.end),
                MaxTopic: p.maxTopic,
                idHiden: p.id
            }
            list.push(newP);
        });
        setListPeriods(list);
    }

    const handleUpdatePeriod = (event, params) => {
        setCurentPeriods(params.row.idHiden);
        setName(params.row.Name);
        setStart(params.row.Start);
        setEnd(params.row.End);
        setMaxTopic(params.row.MaxTopic);
        handleOpenUpdateModal();
    };

    const handlerDeletePeriod = (event, params) => {
        setCurentPeriods(params.row.idHiden);
        handleOpenDeleteModal();
    };

    // Format date
    function formatDate(inputDate) {
        return inputDate.toString().substr(0, 10)
    }

    async function handleUpdate(){
        let data ={
            id: curentPeriods,
            name: name,
            start: start,
            end: end,
            maxTopic: maxTopic,
        };

        let res = await PeriodApi.EditPeriod(data);
        if(res.status === 200){
            rows.forEach(x =>{
                if(x.id === curentPeriods){
                    x.name = data.name;
                    x.start = data.start;
                    x.end = data.end;
                    x.maxTopic = data.maxTopic;
                }
            });
            InitPeriodList();
            handleCloseUpdateModal();
        }
        else{
            setErrorText(res.error);
        }
    }

    async function handleDelete(){
        let data ={
            id: curentPeriods
        }
        let res = await PeriodApi.DeletePeriod(data);
        if(res.status === 400){
            setErrorText(res.error);
        }
        else if(res.status ===200){
            setListPeriods(listPeriods.filter(function(p){
                return p.idHiden !== data.id;
            }));
            handleCloseDeleteModal();
        }
        else{
            setErrorText("Lỗi xóa");
        }
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'Name',
            headerName: 'Tên',
            width: 500,
            editable: true,
        },
        {
            field: 'Start',
            headerName: 'Ngày bắt đầu',
            width: 200,
            editable: true,
        },
        {
            field: 'End',
            headerName: 'Ngày kết thúc',
            width: 200,
            editable: true,
        },
        {
            field: 'MaxTopic',
            headerName: 'Số lượng đề tài',
            width: 50,
            editable: true,
        },
        {
            field: "Edit",
            renderCell: (params) => {
                return (
                    <Button
                        variant="contained"
                        color="warning"
                    onClick={(event) => {
                        handleUpdatePeriod(event, params);
                    }}
                    >Sửa
                    </Button>
                );
            }
        },
        {
            field: "Delete",
            headerName: "Delete",
            width: 100,
            renderCell: (params) => {
                return (
                    <Button
                        variant="contained"
                        color="error"
                    onClick={(event) => {
                        handlerDeletePeriod(event, params);
                    }}
                    >Xóa
                    </Button>
                );
            }
        }
    ]

    return (
        <>
            <Box sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={listPeriods}
                    columns={columns}
                    pageSize={100}
                    rowsPerPageOptions={[100]}
                />
            </Box>

            <Dialog
                fullWidth={true}
                maxWidth={'sm'}
                open={openUpdateModal}
                onClose={handleCloseUpdateModal}>
                <DialogTitle>Chỉnh sửa đợt</DialogTitle>
                <DialogContent>
                    <Grid item xs={9}>
                        <TextField
                            required
                            label="Tên đợi đăng ký"
                            fullWidth
                            autoComplete="off"
                            name="name"
                            value={name}
                            onChange={OnChangeName}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Typography ml={1} mt={2.5}>
                            Ngày mở:
                        </Typography>
                        <Input
                            type="date"
                            required
                            fullWidth
                            autoComplete="off"
                            value={start}
                            onChange={OnChangeStart}
                        ></Input>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography ml={1} mt={2.5}>
                            Ngày đóng:
                        </Typography>
                        <Input
                            type="date"
                            required
                            fullWidth
                            autoComplete="off"
                            value={end}
                            onChange={OnChangeEnd}
                        ></Input>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography ml={1} mt={2.5}>
                            Số lượng đề tài tối đa
                        </Typography>
                        <Input
                            type="number"
                            required
                            fullWidth
                            autoComplete="off"
                            value={maxTopic}
                            onChange={OnChangeMaxTopic}
                        ></Input>
                    </Grid>
                </DialogContent>
                {errorText ? <Box className="error_update_period" sx={{ color: "error.main" }}>{errorText}</Box> : null}
                <DialogActions>
                    <Button onClick={handleCloseUpdateModal}>Hủy</Button>
                    <Button onClick={handleUpdate}>Thêm</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDeleteModal} onClose={handleCloseDeleteModal}>
                <DialogTitle >Bạn có muốn xóa đợt đăng kí này ra khỏi danh sách</DialogTitle>
                <DialogActions>
                    <Button color="primary" onClick={handleCloseDeleteModal}>Không</Button>
                    <Button color="error" onClick={handleDelete}>Có</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}