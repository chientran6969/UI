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
            setErrorText("L???i th??m th??nh vi??n");
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
            headerName: "X??a",
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
                            >X??a
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
                    <Button variant="outlined" onClick={handleOpenAddMember}>Th??m th??nh vi??n</Button>
                </div>
            </Box>
            <Dialog className="dialog_add_member" open={openAddMemberModal} onClose={handleCloseAddMember}>
                <DialogTitle>Th??m th??nh vi??n</DialogTitle>
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
                    <Button onClick={handleCloseAddMember}>H???y</Button>
                    <Button onClick={handleAddMember}>L??u</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openDeleteModal} onClose={handleCloseDeleteModal}>
                <DialogTitle >B???n c?? mu???n x??a th??nh vi??n n??y ra kh???i nh??m</DialogTitle>
                {errorText ? <Box className="error_delete_member" sx={{ color: "error.main" }}>{errorText}</Box> : null}
                <DialogActions>
                    <Button color="primary" onClick={handleCloseDeleteModal}>Kh??ng</Button>
                    <Button color="error" onClick={handleDelete}>C??</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}