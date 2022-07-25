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
import PeriodApi from "../../../api/PeriodApi";
import "./Period.css"
import PeriodList from "./PeriodList";
export default function Period() {

    useEffect(() => {
        InitPeriodList();
    }, []);

    const [periods, setPeriods] = useState([]);

    const [name, setName] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [maxTopic, setMaxTopic] = useState(0);

    // Modal
    const [openAddModal, setOpenAddModal] = useState(false);

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

    const handleOpenAddModal = () => {
        setName("");
        setStart("");
        setEnd("");
        setMaxTopic(0);
        setErrorText("");
        setOpenAddModal(true);
    };

    const handleCloseAddModal = () => {
        setOpenAddModal(false);
    };

    // Add Period
    async function handleAddPeriod() {
        if (name !== "" && start !== "" && end !== "" && maxTopic !== 0) {
            if (maxTopic < 0 || maxTopic >100) {
                setErrorText("Số đề tài phải lớn hơn 1 nhỏ hơn 100");
            } else if (end <= start) {
                setErrorText("Ngày đóng phải sau ngày mở");
            }
            else {
                let data = {
                    name: name,
                    start: start,
                    end: end,
                    maxTopic: maxTopic
                };
                let res = await PeriodApi.AddPeriod(data);
                if (res.status === 201) {
                    setOpenAddModal(false);
                    //setPeriods([res.data,...periods]);
                    InitPeriodList();
                }
                else if (res.status === 400) {
                    setErrorText(res.error);
                }
            }
        }
        else {
            setErrorText("Nhập chưa đủ thông tin");
        }
    }

    // Init PeriodStudentApi
    async function InitPeriodList() {
        let periodsList = await (await PeriodApi.GetPeriodList()).data;
        setPeriods(periodsList);
    }

    // Format date
    function formatDate(inputDate) {
        return inputDate.toString().substr(0, 10)
    }

    return (
        <>
            <Button
                variant="outlined"
                color="primary"
                onClick={handleOpenAddModal}
            >Thêm đợt</Button>
            <PeriodList rows={periods} />

            <Dialog
                fullWidth={true}
                maxWidth={'sm'}
                open={openAddModal}
                onClose={handleCloseAddModal}>
                <DialogTitle>Thêm đợt</DialogTitle>
                <DialogContent>
                    <Grid item xs={9}>
                        <TextField
                            required
                            label="Tên đợi đăng ký"
                            fullWidth
                            autoComplete="off"
                            name="name"
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
                            onChange={OnChangeMaxTopic}
                        ></Input>
                    </Grid>
                </DialogContent>
                {errorText ? <Box className="error_add_period" sx={{ color: "error.main" }}>{errorText}</Box> : null}
                <DialogActions>
                    <Button onClick={handleCloseAddModal}>Hủy</Button>
                    <Button onClick={handleAddPeriod}>Thêm</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}