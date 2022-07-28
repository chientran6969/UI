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
    Snackbar
} from "@mui/material";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import { DataGrid } from "@mui/x-data-grid";
import EngineeringIcon from '@mui/icons-material/Engineering';
import userApi from "../../../api/userApi";

export default function AccountList({ rows }) {

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");

    const [role, setRole] = useState("");

    const [openDecenModal, setOpenDecenModal] = useState(false);
    const [openActiveModal, setOpenActiveModal] = useState(false);
    const [openDeActiveModal, setOpenDeActiveModal] = useState(false);

    const [errorText, setErrorText] = useState("");

    const handleOpenActiveModal = () => {
        setOpenActiveModal(true);
    }

    const handleCloseActiveModal = () => {
        setOpenActiveModal(false);
    }

    const handleOpenDeActiveModal = () => {
        setOpenDeActiveModal(true);
    }

    const handleCloseDeActiveModal = () => {
        setOpenDeActiveModal(false);
    }


    const handleOpenDecenModal = () => {
        setOpenDecenModal(true);
    }

    const handleCloseDecenModal = () => {
        setOpenDecenModal(false);
    }

    useEffect(() => {
        InitListAccount();
    }, [rows]);

    function InitListAccount() {
        let data = [];
        rows.forEach((r, index) => {
            let d = {
                id: index + 1,
                email: r.email,
                state: r.active,
                role: r.role,
                idHidden: r.id
            }

            data.push(d);
        });
        setUsers(data);
    }

    const handleChangeRole = (e) => {
        setRole(e.target.value);
    }

    const handlePreDecen = (e, params) => {
        setSelectedUser(params.row.idHidden);
        setRole(params.row.role);
        handleOpenDecenModal();
    }

    const handlePreActive = (e, params) => {
        setSelectedUser(params.row.idHidden);
        handleOpenActiveModal();
    }

    const handlePreDeActive = (e, params) => {
        setSelectedUser(params.row.idHidden);
        handleOpenDeActiveModal();
    }

    async function handleDecen() {
        let data = {
            id: selectedUser,
            role: role
        }
        let res = await userApi.DecenAccount(data);
        if(res.status === 200){
            users.forEach((u) => {
                if(u.idHidden === selectedUser){
                    u.role = role;
                }
            });
            handleCloseDecenModal();
        }
    }

    async function handleActive() {
        let data = {
            id: selectedUser,
            active: true
        }

        let res = await userApi.ActiveAccount(data);
        if(res.status === 200){
            users.forEach((x) => {
                if(x.idHidden === res.data.id){
                    x.state = res.data.active;
                }
            });
            handleCloseActiveModal();
        }
    }

    async function handleDeActive() {
        let data = {
            id: selectedUser,
            active: false
        }
        let res = await userApi.ActiveAccount(data);
        if(res.status === 200){
            users.forEach((x) => {
                if(x.idHidden === res.data.id){
                    x.state = res.data.active;
                }
            });
            handleCloseDeActiveModal();
        }
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'email',
            headerName: 'Email',
            width: 200,
        },
        {
            field: 'state',
            headerName: 'Trạng thái',
            width: 100,
            renderCell: (params) => {
                if (params.row.state) {
                    return (<EngineeringIcon color="success">

                    </EngineeringIcon>)
                }
                else {
                    return (
                        <PersonOffIcon
                            color="error"
                        ></PersonOffIcon>
                    );
                }
            }
        },
        {
            field: 'role',
            headerName: 'Quyền',
            width: 100,
        },
        {
            field: "ChangeRole",
            headerName: "Đổi quyền",
            width: 100,
            renderCell: (params) => {

                return (
                    <Button
                        variant="outlined"
                        color="warning"
                        onClick={(event) => {
                            handlePreDecen(event, params);
                        }}
                    >Đổi
                    </Button>
                );
            }
        },
        {
            field: "Delete",
            headerName: "Enable/Disable",
            width: 200,
            renderCell: (params) => {
                if (params.row.state) {
                    return (
                        <Button
                            variant="contained"
                            color="error"
                            onClick={(event) => {
                                handlePreDeActive(event, params);
                            }}
                        >
                            Tắt
                        </Button>
                    );
                } else {
                    return (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={(event) => {
                                handlePreActive(event, params);
                            }}
                        >Mở
                        </Button>
                    );
                }
            }
        }
    ];

    return (
        <>
            <Box sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={users}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                />
            </Box>

            <Dialog
                fullWidth={true}
                maxWidth={'sm'}
                open={openDecenModal}
                onClose={handleCloseDecenModal}
            >
                <DialogTitle>Thay đổi quyền người dùng</DialogTitle>
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
                    <Button onClick={handleCloseDecenModal} >Hủy</Button>
                    <Button onClick={handleDecen}>Thêm</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                fullWidth={true}
                maxWidth={'sm'}
                open={openActiveModal}
                onClose={handleCloseActiveModal}
            >
                <DialogTitle>Bạn có muốn kích hoạt tài khoản này</DialogTitle>
                {errorText ? <Box className="error_add_period" sx={{ color: "error.main" }}>{errorText}</Box> : null}
                <DialogActions>
                    <Button onClick={handleCloseActiveModal} >Không</Button>
                    <Button onClick={handleActive}>Có</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                fullWidth={true}
                maxWidth={'sm'}
                open={openDeActiveModal}
                onClose={handleCloseDeActiveModal}
            >
                <DialogTitle>Bạn có muốn vô hiệu hóa tài khoản này</DialogTitle>
                {errorText ? <Box className="error_add_period" sx={{ color: "error.main" }}>{errorText}</Box> : null}
                <DialogActions>
                    <Button onClick={handleCloseDeActiveModal} >Không</Button>
                    <Button color="error" onClick={handleDeActive}>có</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}