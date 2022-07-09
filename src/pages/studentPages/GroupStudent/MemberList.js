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
import GroupMemberApi from "../../../api/GroupMemberApi";

export default function MemberList({ rows, group, isLeader }) {

    const [students, setStudents] = useState([]);

    const [memberStudentId, setMemberStudentId] = useState("");

    const [errorText, setErrorText] = useState("");
    useEffect(() => {
        InitMemberList(rows);
    }, [rows]);

    //Modal management
    const [openAddMemberModal, setOpenAddMemberModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const handleOpenAddMember = () => {
        setOpenAddMemberModal(true)
        setMemberStudentId("");
        setErrorText("");
    };
    const handleOpenDeleteModal = () => {
        setOpenDeleteModal(true);
    };

    const handleCloseAddMember = () => {
        setOpenAddMemberModal(false)
        setMemberStudentId("");
        setErrorText("");
    };
    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false)
        setDeleteStudentId("");
    };

    // StudentId Manager
    const [deleteStudentId, setDeleteStudentId] = useState("");

    const handleOnChangeTextFieldAdd = (e) => {
        setMemberStudentId(e.target.value);
    };

    const handleDeleteStudent = (event, params) => {
        setDeleteStudentId(params.row.MSSV);
    };

    function InitMemberList(rows) {
        let list = [];
        rows.forEach((row, index) => {
            list.push({
                id: index + 1,
                MSSV: row.studentId
            });
        });

        setStudents(list);
    }

    //Add Member
    async function handleAddMember() {
        let data = {
            groupId: group.id,
            studentId: memberStudentId
        };
        let res = await GroupMemberApi.AddMemeber(data);
        console.log(res);
        if (res.status === 400) {
            setErrorText(res.error);
        }
        else if (res.status === 200) {
            let data = {
                id: GetId(),
                MSSV: res.data.studentId
            }
            setStudents([...students, data]);

            handleCloseAddMember();
        }
        else {
            setErrorText("Lỗi thêm thành viên");
        }
    }

    //Delete
    async function handleDelete() {
        let data = {
            groupId: group.id,
            studentId: deleteStudentId
        };
        let res = await GroupMemberApi.DeleteMember(data);
        if (res.status === 200) {
            setStudents(students.filter(function (item) {
                return item.MSSV !== data.studentId
            }));

            handleCloseDeleteModal();
        } else {
            setErrorText(res.error);
        }
    }

    function GetId(){
        let max = 0;
        students.forEach((i) =>{
            if(i.id > max){
                max = i.id;
            }
        })
        return max+1;
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'MSSV',
            headerName: 'MSSV',
            width: 400,
            editable: true,
        },
        {
            field: "Delete",
            headerName: "Xóa",
            width: 100,
            renderCell: (params) => {
                return (
                    (params.row.MSSV !== group.leaderStudentId) ?
                        <div hidden={isLeader} >
                            <Button
                                variant="contained"
                                color="error"
                                onClick={(event) => {
                                    handleOpenDeleteModal();
                                    handleDeleteStudent(event, params);
                                }}
                            >Xóa
                            </Button>
                        </div> : ""
                );
            }
        }
    ];

    return (
        <>
            <Box sx={{ height: 300, width: '100%' }}>
                <DataGrid
                    rows={students}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                />
                <div hidden={isLeader}>
                    <Button variant="outlined" onClick={handleOpenAddMember}>Thêm thành viên</Button>
                </div>
            </Box>
            <Dialog className="dialog_add_member" open={openAddMemberModal} onClose={handleCloseAddMember}>
                <DialogTitle>Thêm thành viên</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="mssv"
                        label="MSSV"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={handleOnChangeTextFieldAdd}
                    />
                </DialogContent>
                {errorText ? <Box className="error_add_member" sx={{ color: "error.main" }}>{errorText}</Box> : null}
                <DialogActions>
                    <Button onClick={handleCloseAddMember}>Hủy</Button>
                    <Button onClick={handleAddMember}>Lưu</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openDeleteModal} onClose={handleCloseDeleteModal}>
                <DialogTitle >Bạn có muốn xóa thành viên này ra khỏi nhóm</DialogTitle>
                {errorText ? <Box className="error_delete_member" sx={{ color: "error.main" }}>{errorText}</Box> : null}
                <DialogActions>
                    <Button color="primary" onClick={handleCloseDeleteModal}>Không</Button>
                    <Button color="error" onClick={handleDelete}>Có</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}