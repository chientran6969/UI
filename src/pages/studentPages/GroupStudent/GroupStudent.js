import React, { useEffect, useState } from "react";
import PeriodStudentApi from "../../../api/PeriodStudentApi";
import GroupStudentApi from "../../../api/GroupStudentApi";
import GroupMemberApi from "../../../api/GroupMemberApi";
import MemberList from "./MemberList";
import {
    Button,
    TextField,
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
    Input,
    Box,
    Snackbar,
    Hidden
} from '@mui/material';
import "./GroupStudent.css"
export default function GroupStudent() {

    const [periods, setPeriods] = useState([]);
    const [selectedPeriod, setSelectedPeriod] = useState("");

    const [groupName, setGroupName] = useState("");

    const [hasGroup, setHasGroup] = useState(false);
    const [myGroup, setMyGroup] = useState();

    const [isLeader, setIsLeader] = useState(false);


    // Error
    const [errorTextAdd, setErrorTextAdd] = useState("");


    // Modal
    const [openAddGroup, setOpenAddGroup] = useState(false);
    const [openEditGroup, setOpenEditGroup] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);


    const handleCloseAddGroup = () => {
        setOpenAddGroup(false);
    }

    const handleOpenAddGroup = () => {
        setGroupName("");
        setOpenAddGroup(true);
        setErrorTextAdd("");
    }

    const handleCloseDeleteGroup = () => {
        setOpenDeleteModal(false);
    }

    const handleOpenDeleteGroup = () => {
        setOpenDeleteModal(true);
    }

    const handleCloseEditGroup = () => {
        setOpenEditGroup(false);
    }

    const handleOpenEditGroup = () => {
        setGroupName("");
        setOpenEditGroup(true);
        setErrorTextAdd("");
    }

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
        setErrorTextAdd("");
    };

    useEffect(() => {
        InitPeriodList();
    }, []);

    async function InitPeriodList() {
        let periodsList = await (await PeriodStudentApi.GetPeriodList()).data;
        setPeriods(periodsList)
    }

    async function GetMyGroupInPeriod() {
        if (selectedPeriod !== "") {
            let params = {
                PeriodId: selectedPeriod
            }

            let res = await GroupStudentApi.GetMyGroupInPeriod(params);

            if (res.status === 200) {
                setHasGroup(true);
                setMyGroup(res.data);

            }
            else {
                setHasGroup(false);
                setMyGroup();
            }
        }
    }

    function handleChangeGroupName(e) {
        setGroupName(e.target.value);
    }


    async function handleChange(event) {
        if (event.target.value !== "0") {
            let params = {
                PeriodId: event.target.value
            }

            let res = await GroupStudentApi.GetMyGroupInPeriod(params);

            if (res.status === 200) {
                setHasGroup(true);
                setMyGroup(res.data);

                const item = JSON.parse(localStorage.getItem('user'));
                if (item) {
                    let leaderStudentId = res.data.leaderStudentId;
                    let yourStudentId = item.email.split("@")[0];
                    if (leaderStudentId === yourStudentId) {
                        setIsLeader(false);
                    } else {
                        setIsLeader(true);
                    }
                }
            }
            else {
                setHasGroup(false);
                setMyGroup();
            }

            setSelectedPeriod(event.target.value);
        }
        else {
            setSelectedPeriod("");
            setHasGroup(false);
            setMyGroup();
        }
    }

    async function handleAddGroup() {
        let params = {
            name: groupName,
            periodId: selectedPeriod
        }
        let group = await GroupStudentApi.AddGroup(params);
        if (group.status === 200) {
            await callbackAddGroup(group);
            handleCloseAddGroup();
            setIsLeader(false);
        } else {
            setHasGroup(false);
            setMyGroup();
            setErrorTextAdd(group.error);
        }

    }

    async function callbackAddGroup(group) {
        setIsLeader(true);
        setHasGroup(true);
        setMyGroup(group.data);
    }

    async function handleEditGroup() {
        if(groupName !==""){
            let data = {
                groupId: myGroup.id,
                name: groupName
            }
    
            let response = await GroupStudentApi.EditGroup(data);
            if (response.status === 200) {
                handleCloseEditGroup();
                setMyGroup(response.data);
            }
            else {
                setErrorTextAdd(response.error);
            }
    
        }
        else{
            setErrorTextAdd("Bạn chưa nhập tên nhóm");
        }
    }

    async function handleDeleteGroup() {
        let data = {
            groupId: myGroup.id,
        }
        let response = await GroupStudentApi.DeleteGroup(data);
        if(response.status === 200) {
            handleCloseDeleteGroup();
            setMyGroup();
            setHasGroup(false);
        }
        else if(response.status === 400){
            setErrorTextAdd(response.error);
            setOpenSnackbar(true);
        }
    }

    return (
        <>
            <div className="mb-3">
                <div className="select">
                    <select defaultValue={"0"} className="format" id="format" onChange={handleChange}>
                        <option value="0">Chọn đợt đăng kí</option>
                        {periods.map((option) => (
                            <option key={option.id} value={option.id}>{option.name}</option>
                        ))}
                    </select>
                </div>
                {(!hasGroup && selectedPeriod !== "") ?
                    <div className="addzone">
                        <Button onClick={handleOpenAddGroup} className="btn_add_group" variant="outlined" color="primary"  >Tạo nhóm</Button>
                    </div> : (selectedPeriod !== "") ?
                        <div>
                            <div className="text_group_name">{myGroup?.name}</div>
                            <br></br>
                            <div hidden={isLeader} className="edit_delete_group_zone">
                                <Button onClick={handleOpenEditGroup} variant="contained" color="warning">Đổi tên</Button>
                                <span>   </span>
                                <Button onClick={handleOpenDeleteGroup} variant="contained" color="error">Xóa</Button>
                            </div>
                            <br></br>
                            <MemberList group={myGroup} rows={myGroup?myGroup.students:[]} isLeader={isLeader}/>
                        </div>
                        : ""
                }
            </div>
            <Dialog open={openAddGroup} onClose={handleCloseAddGroup}>
                <DialogTitle>Tạo nhóm</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="Tên nhóm"
                        label="Tên nhóm"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={handleChangeGroupName}
                    />
                </DialogContent>
                {errorTextAdd ? <Box className="error_add_group" sx={{ color: "error.main" }}>{errorTextAdd}</Box> : null}
                <DialogActions>
                    <Button onClick={handleCloseAddGroup} >Hủy</Button>
                    <Button onClick={handleAddGroup} >Thêm</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openEditGroup} onClose={handleCloseEditGroup}>
                <DialogTitle>Đổi tên</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="Tên nhóm"
                        label="Tên nhóm"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={handleChangeGroupName}
                    />
                </DialogContent>
                {errorTextAdd ? <Box className="error_add_group" sx={{ color: "error.main" }}>{errorTextAdd}</Box> : null}
                <DialogActions>
                    <Button onClick={handleCloseEditGroup} >Hủy</Button>
                    <Button onClick={handleEditGroup} >Lưu</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openDeleteModal} onClose={handleCloseDeleteGroup}>
                <DialogTitle >Bạn có muốn xóa nhóm này ra khỏi danh sách</DialogTitle>
                <DialogActions>
                    <Button color="primary" onClick={handleCloseDeleteGroup}>Không</Button>
                    <Button color="error" onClick={handleDeleteGroup}>Có</Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                message={errorTextAdd}
            />
        </>
    );
}