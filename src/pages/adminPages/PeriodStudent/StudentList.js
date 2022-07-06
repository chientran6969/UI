import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    TextField,
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import PeriodStudentApi from "../../../api/PeriodStudentApi";

export default function StudentList({ rows, period }) {

    const [students, setStudents] = useState([]);

    useEffect(() =>{
        setStudents(rows);
    },[rows]);

    //Modal management
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const handleOpenUpdateModal = () => {
        setOpenUpdateModal(true)
        setNewStudentId("");
        setErrorEdit("");
    };
    const handleOpenDeleteModal = () => {
        setOpenDeleteModal(true);
    };

    const handleCloseUpdateModal = () => {
        setOpenUpdateModal(false)
        setCurrentStudentId("");
        setNewStudentId("");
        setErrorEdit("");
    };
    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false)
        setCurrentStudentId("");
    };

    // StudentId Manager
    const [currentStudentId, setCurrentStudentId] = useState("");
    const [newStudentId, setNewStudentId] = useState("");
    const handleOnChangeTextFieldUpdate = (e) => {
        setNewStudentId(e.target.value);
    };

    // error
    const [errorEdit, setErrorEdit] = useState("");

    const handleUpdateStudent = (event, params) => {
        setCurrentStudentId(params.row.MSSV);
    };

    const handlerDeleteStudent = (event, params) => {
        setCurrentStudentId(params.row.MSSV);
    };

    // Update
    async function handleUpdate(){
        let data = {
            periodId: period,
            oldStudentId: currentStudentId,
            newStudentId: newStudentId
        };
        let res = await PeriodStudentApi.UpdatePeriodStudent(data);
        if(res.status === 400){
            setErrorEdit(res.error);
        }
        if(res.status === 200){
            rows.forEach(e => {
                if(e.MSSV === currentStudentId){
                    e.MSSV = newStudentId;
                }
            });
            handleCloseUpdateModal();
        }
    }

    //Delete
    async function handleDelete(){
        let data = {
            periodId: period,
            studentId: currentStudentId
        };
        let res = await PeriodStudentApi.DeletePeriodStudent(data);
        if(res.status === 200){
            setStudents(students.filter(function(item) {
                return item.MSSV !== data.studentId
            }));

            handleCloseDeleteModal();
        }
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'MSSV',
            headerName: 'MSSV',
            width: 500,
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
                            handleOpenUpdateModal();
                            handleUpdateStudent(event, params);
                        }}
                    >
                        Sửa
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
                            handleOpenDeleteModal();
                            handlerDeleteStudent(event, params);
                        }}
                    >Xóa
                    </Button>
                );
            }
        }
    ];

    return (
        <>
            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={students}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                />
            </Box>
            <Dialog open={openUpdateModal} onClose={handleCloseUpdateModal}>
                <DialogTitle>Cập nhật mã số sinh viên</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="mssv"
                        label="MSSV"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={handleOnChangeTextFieldUpdate}
                    />
                </DialogContent>
                {errorEdit ? <Box className="error_add_student" sx={{ color: "error.main" }}>{errorEdit}</Box> : null}
                <DialogActions>
                    <Button onClick={handleCloseUpdateModal}>Hủy</Button>
                    <Button onClick={handleUpdate}>Lưu</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openDeleteModal} onClose={handleCloseDeleteModal}>
                <DialogTitle >Bạn có muốn xóa MSSV này ra khỏi danh sách</DialogTitle>
                <DialogActions>
                    <Button color="primary" onClick={handleCloseDeleteModal}>Không</Button>
                    <Button color="error" onClick={handleDelete}>Có</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}