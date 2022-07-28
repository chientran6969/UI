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
} from "@mui/material";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import AccountList from "./AccountList";
import userApi from "../../../api/userApi";

export default function AccountManager() {

    const [users, setUsers] = useState([]);

    const ADMIN = "4B8287CA-14ED-4A8B-8E7E-8184CAFF8A5E";
    const TEACHER = "5B8287CA-14ED-4A8B-8E7E-8184CAFF8A5E";

    const [errorText, setErrorText] = useState("");
    const [openAddModal, setOpenAddModal] = useState(false);

    const [email, setEmail] = useState("");
    const [role, setRole] = useState("Teacher");

    const handleChangeRole = (event) => {
        setRole(event.target.value);
    };

    const handleChangeEmail = (event) => {
        setEmail(event.target.value);
    }

    const handleOpenAddModal = () => {
        setErrorText("");
        setEmail("");
        setRole("Teacher");
        setOpenAddModal(true);
    }

    const handleCloseAddModal = () => {
        setErrorText("");
        setRole("Teacher");
        setOpenAddModal(false);
    }

    useEffect(() => {
        InitAccountList();
    }, []);

    async function InitAccountList() {
        let res = await userApi.GetLocalAccount();
        if (res.status === 200) {
            setUsers(res.data);
        }
    }

    async function handleAdd() {
        if(email === ""){
            setErrorText("Chưa nhập email");
        }
        else if(!isValidEmail(email)){
            setErrorText("Email không phải tài khoản nội bộ");
        }
        else{
            let roleId = (role==="Admin")?ADMIN:TEACHER;
            let data = {
                email: email,
                roleId: roleId
            }
            
            let res = await userApi.AddAccount(data);
            if(res.status === 200){
                InitAccountList();
                handleCloseAddModal();
            }else{
                setErrorText(res.error);
            }
        }

    }

    function isValidEmail(email) {
        if(!email.includes('@tdtu.edu.vn')){
            return false;
        }
        return true;
    }

    return (
        <>
            <div className="mb-3">
                <div className="addzone">
                    <Button onClick={handleOpenAddModal} className="btn_add_student" variant="outlined" color="primary">Thêm tài khoản mới</Button>
                </div>
                <div className="student_data_table">
                    <AccountList rows={users}></AccountList>
                </div>
            </div>

            <Dialog
                fullWidth={true}
                maxWidth={'sm'}
                open={openAddModal}
                onClose={handleCloseAddModal}
            >
                <DialogTitle>Thêm người dùng mới</DialogTitle>
                <DialogContent>
                    <Grid item xs={9}>
                        <TextField
                            required
                            label="Email"
                            fullWidth
                            autoComplete="off"
                            name="name"
                            onChange={handleChangeEmail}
                        />
                    </Grid>
                </DialogContent>
                <DialogContent>
                    <Typography ml={1} mt={2.5}>
                        Quyền:
                    </Typography>
                    <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={role}
                        onChange={handleChangeRole}
                    >
                        <FormControlLabel value="Teacher" control={<Radio />} label="Giáo viên" />
                        <FormControlLabel value="Admin" control={<Radio />} label="Quản trị viên" />
                    </RadioGroup>
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