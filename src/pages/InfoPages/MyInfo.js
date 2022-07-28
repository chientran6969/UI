import React, { useEffect, useState } from "react";
import userApi from "../../api/userApi";
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
    Snackbar,
    TextareaAutosize,
    Card,
    CardContent,
    CardActions,
    Stack
} from "@mui/material";

export default function MyInfo() {

    const [myInfo, setMyInfo] = useState("");

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openSnackbarSuccess, setOpenSnackbarSuccess] = useState(false);

    const [errorText, setErrorText] = useState("");
    const [successText, setSuccessText] = useState("");

    const [openPwdModal, setOpenPwdModal] = useState(false);


    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [birthday, setBirthday] = useState("");
    const [phone, setPhone] = useState("");

    const [pwdOld, setPwdOld] = useState("");
    const [pwdNew, setPwdNew] = useState("");
    const [pwdNew2, setPwdNew2] = useState("");


    const handleOpenPwdModal = () => {
        setOpenPwdModal(true);
        setPwdOld("");
        setPwdNew("");
        setPwdNew2("");
    }

    const handleClosePwdModal = () => {
        setOpenPwdModal(false);
    }

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    }

    const handleCloseSnackbarSuccess = () => {
        setOpenSnackbarSuccess(false);
    }

    useEffect(() => {
        InitInfo();
    }, []);

    async function InitInfo() {
        const item = JSON.parse(localStorage.getItem('user'));
        if (item) {
            let data = {
                email: item.email
            }

            let res = await userApi.GetMyInfo(data);
            if (res.status === 200) {
                res.data.birthday = formatDate(res.data.birthday);
                setBirthday(formatDate(res.data.birthday));
                setLastName(res.data.lastName);
                setFirstName(res.data.firstName);
                setPhone(res.data.phone);
                setMyInfo(res.data);
            } else {
                setErrorText(res.error);
                setOpenSnackbar(true);
            }
        }
    }

    const handleChangeFirstName = (e) => {
        setFirstName(e.target.value);
    }

    const handleChangeLastName = (e) => {
        setLastName(e.target.value);
    }
    const handleChangePhone = (e) => {
        setPhone(e.target.value);
    }

    const handleChangeBirthday = (e) => {
        setBirthday(e.target.value);
    }

    const handleChangePwdOld = (e) => {
        setPwdOld(e.target.value);
    }

    const handleChangePwdNew = (e) => {
        setPwdNew(e.target.value);
    }

    const handleChangePwdNew2 = (e) => {
        setPwdNew2(e.target.value);
    }

    // Format date
    function formatDate(inputDate) {
        return inputDate.toString().substr(0, 10)
    }

    async function handleUpdate() {
        if (firstName === "" || lastName === "") {
            setErrorText("Các trường tên không được bỏ trống");
        }
        else if (!phoneValidation(phone)) {
            setErrorText("Số điện thoại không đúng định dạng");
        }
        else {
            let data = {
                id: myInfo.id,
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                birthday: birthday,
            }

            let res = await userApi.ChangeMyInfo(data);
            if (res.status === 200) {
                setSuccessText("Cập nhật thông tin thành công");
                setOpenSnackbarSuccess(true);
            } else {
                setErrorText("Thông tin nhập không đúng định dạng");
            }
        }
    }

    async function handleChangePwd() {
        if(!pwdValidation(pwdOld)){
            setErrorText("Mật khẩu cũ phải từ 8-16 kí tự, gồm chữ hoa, chữ thường, số và kí tự đặc biệt");
        }
        else if(!pwdValidation(pwdNew)){
            setErrorText("Mật khẩu mới phải từ 8-16 kí tự, gồm chữ hoa, chữ thường, số và kí tự đặc biệt");
        }
        else if(pwdNew !== pwdNew2){
            setErrorText("Mật khẩu mới và mật khẩu xác nhận không trùng khớp");
        }else{
            let data = {
                id: myInfo.id,
                oldPassword: pwdOld,
                newPassword: pwdNew
            }

            let res = await userApi.ChangePassword(data);

            if(res.status === 200){
                handleClosePwdModal();
                setSuccessText("Đổi mật khẩu thành công");
                setOpenSnackbarSuccess(true);
                setErrorText("");
            }
            else{
                setErrorText(res.error);
            }
        }
    }

    function phoneValidation(phone) {
        const regex = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i;
        return !(!phone || regex.test(phone) === false);
    }

    function pwdValidation(pwd){
        const regex = new RegExp("^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$");
        return regex.test(pwd);
    }

    return (
        <>
            <Card sx={{ minWidth: 300, maxWidth: 600 }}>
                <CardContent>
                    <Box
                        sx={{ width: '100%', maxWidth: 500, m: 1 }}
                    >
                        <Typography variant="h4" gutterBottom component="div">
                            {myInfo.email}
                        </Typography>
                        <TextField
                            label="First Name"
                            variant="standard"
                            color="warning"
                            value={firstName}
                            focused
                            sx={{ m: 1 }}
                            onChange={handleChangeFirstName}
                        />
                        <TextField
                            label="Last Name"
                            variant="standard"
                            color="warning"
                            value={lastName}
                            onChange={handleChangeLastName}
                            sx={{ m: 1 }}
                            focused
                        />
                        <TextField
                            label="Phone"
                            variant="standard"
                            color="warning"
                            value={phone}
                            onChange={handleChangePhone}
                            sx={{ m: 1 }}
                            focused
                        />
                        <Stack color="warning" component="form" noValidate spacing={3}>
                            <TextField
                                id="date"
                                label="Birthday"
                                type="date"
                                color="warning"
                                value={birthday}
                                onChange={handleChangeBirthday}
                                sx={{ width: 220, m: 1 }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Stack>
                    </Box>

                </CardContent>
                {errorText ? <Box className="error_add_period" sx={{ color: "error.main" }}>{errorText}</Box> : null}
                <CardActions>
                    <Button onClick={handleUpdate} color="warning" variant="contained">Cập nhật thông tin</Button>
                    <Button onClick={handleOpenPwdModal} color="error" variant="contained">Đổi mật khẩu</Button>
                </CardActions>
            </Card>

            <Dialog
                fullWidth={true}
                maxWidth={'sm'}
                open={openPwdModal}
                onClose={handleClosePwdModal}>
                <DialogTitle>Đổi mật khẩu</DialogTitle>
                <br></br>
                <DialogContent>
                    <Grid item xs={9}>
                        <TextField
                            required
                            label="Mật khẩu cũ"
                            fullWidth
                            autoComplete="off"
                            type="password"
                            onChange={handleChangePwdOld}
                        />
                    </Grid>

                </DialogContent>
                <DialogContent>
                    <Grid item xs={9}>
                        <TextField
                            required
                            label="Mật khẩu mới"
                            fullWidth
                            autoComplete="off"
                            type="password"
                            onChange={handleChangePwdNew}
                        />
                    </Grid>
                </DialogContent>
                <DialogContent>
                    <Grid item xs={9}>
                        <TextField
                            required
                            label="Nhập lại mật khẩu mới"
                            fullWidth
                            autoComplete="off"
                            type="password"
                            onChange={handleChangePwdNew2}
                        />
                    </Grid>
                </DialogContent>

                {errorText ? <Box className="error_add_period" sx={{ color: "error.main" }}>{errorText}</Box> : null}
                <DialogActions>
                    <Button onClick={handleClosePwdModal}>Hủy</Button>
                    <Button onClick={handleChangePwd}>Lưu</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                message={errorText}
            />

            <Snackbar
                open={openSnackbarSuccess}
                autoHideDuration={4000}
                onClose={handleCloseSnackbarSuccess}
                message={successText}
            />
        </>
    );
}