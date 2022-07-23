import React, { useEffect, useState } from "react";
import PeriodApi from "../../../api/PeriodApi";
import TopicApi from "../../../api/TopicApi";
import PeriodTopicApi from "../../../api/PeriodTopicApi";
import userApi from "../../../api/userApi";
import GroupStudentApi from "../../../api/GroupStudentApi";
import PeriodTopicStudentApi from "../../../api/PeriodTopicStudentApi";
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
    TextareaAutosize
} from "@mui/material";
import MyPTSList from "./MyPTSList";

export default function MyPeriodTopicStudent() {
    
    const dataRaw = {
        topicName: "",
        major: "",
        teacher: "",
        description: ""
    }

    const [periods, setPeriods] = useState([]);
    const [selectedPeriod, setSelectedPeriod] = useState("0");
    const [PTSList, setPTSList] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [dataAdd, setDataAdd] = useState(dataRaw);
    const [myGroup, setMyGroup] = useState("");

    // Modal
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);

    const [errorText, setErrorText] = useState("");

    useEffect(() => {
        InitPeriodList();
        InitTeacherList();
        InitGroup();
    },[selectedPeriod]);

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    }

    const handleOpenAddModal = () => {
        if(myGroup){
            if (selectedPeriod !== "0") {
                setOpenAddModal(true);
                setErrorText("");
                setDataAdd(dataRaw);
            }
            else {
                setErrorText("Chưa chọn đợt đăng kí");
                setOpenSnackbar(true);
            }
        }else{
            setErrorText("Chưa tạo nhóm đăng kí trong đợt này");
            setOpenSnackbar(true);
        }
    }

    const handleCloseAddModal = () => {
        setOpenAddModal(false);
    }

    async function InitMyPTSInPeriod(period){
        let res = await PeriodTopicStudentApi.GetOwnPTSInPeriod({ periodId: period });
        if(res.status === 200){
            setPTSList(res.data);
        }
    }

    async function InitPeriodList() {
        let periodsList = await (await PeriodApi.GetPeriodList()).data;
        setPeriods(periodsList);
    }

    async function InitTeacherList() {
        let res = await userApi.GetTeacherList();
        if (res.status === 200) {
            setTeachers(res.data);
        }
    }

    async function InitGroup() {
        if(selectedPeriod !== "0"){
            let res = await GroupStudentApi.GetMyGroupInPeriod({ periodId: selectedPeriod });

            if (res.status === 200) {
                setMyGroup(res.data);
            }
            else {
                setMyGroup("");
            }
        }else{
            setMyGroup("");
        }
    }
    
    const handleChangeName = (e) => {
        let data = dataAdd;
        data.topicName = e.target.value;
        setDataAdd(data);
    }

    const handleChangeMajor = (e) => {
        let data = dataAdd;
        data.major = e.target.value;
        setDataAdd(data);
    };

    const handleChangeTeacher = (e) => {
        let data = dataAdd;
        data.teacher = e.target.value;
        setDataAdd(data);
    };

    const handleChangeDescription = (e) => {
        let data = dataAdd;
        data.description = e.target.value;
        setDataAdd(data);
    };

    function handleChangePeriod(event) {
        if (event.target.value !== "0") {
            setSelectedPeriod(event.target.value);
            InitMyPTSInPeriod(event.target.value);
            //InitPeriodTopicList(event.target.value);
        }
        else {
            //setPeriodTopics([]);
            setSelectedPeriod("0");
        }
    }

    async function handleAdd() {
        if (dataAdd.topicName === ""
            || dataAdd.major === ""
            || dataAdd.teacher === "0"
            || dataAdd.description === "") {
            setErrorText("Chưa nhập đủ thông tin");
        }
        else if (!myGroup){
            setErrorText("Bạn chưa tạo nhóm cho đợt đăng kí này");
            setOpenSnackbar(true);
        }
        else {
            let data = {
                name: dataAdd.topicName,
                major: dataAdd.major,
                description: dataAdd.description
            };
            let res = await TopicApi.AddTopic(data);
            if (res.status === 200) {
                handleAddPeriodTopic(res.data);
            } else {
                setErrorText(res.error);
            }
        }
    }

    async function handleAddPeriodTopic(data) {
        let input = {
            periodId: selectedPeriod,
            topicId: data.id,
            teacherId: dataAdd.teacher,
            groupStudentId: myGroup?.id,
            maxRegister: 1,
            maxMember: 1
        }
        let res = await PeriodTopicApi.AddPeriodTopicByS(input);
        if (res.status === 200) {
            InitMyPTSInPeriod(selectedPeriod);
            handleCloseAddModal();
        }
        else {
            let d = {
                id: data.id
            };
            await TopicApi.DeleteTopic(d);
        }
    }
    return (
        <>
            <div className="mb-3">
                <div className="select">
                    <select onChange={handleChangePeriod} defaultValue={"0"} className="format" id="format">
                        <option value="0">Chọn đợt đăng kí</option>
                        {periods.map((option) => (
                            <option key={option.id} value={option.id}>{option.name}</option>
                        ))}
                    </select>
                </div>

                <div className="addzone">
                    <Button onClick={handleOpenAddModal} className="btn_add_student" variant="outlined" color="primary">Đề xuất đề tài khác</Button>
                </div>
                <br />
                <div className="pts_data_table">
                    <MyPTSList rows={PTSList}></MyPTSList>
                </div>
            </div>

            <Dialog
                fullWidth={true}
                maxWidth={'md'}
                open={openAddModal}
                onClose={handleCloseAddModal}>
                <DialogTitle>Thêm đề tài mới</DialogTitle>
                <DialogContent>
                    <Grid item xs={9}>
                        <Typography ml={1} mt={2.5}>
                            Tên đề tài
                        </Typography>
                        <TextField
                            required
                            label="Tên đề tài"
                            fullWidth
                            autoComplete="off"
                            name="name"
                            onChange={handleChangeName}
                        />
                    </Grid>
                    <Grid item xs={9}>
                        <Typography ml={1} mt={2.5}>
                            Nhóm ngành
                        </Typography>
                        <TextField
                            required
                            label="Ngành"
                            fullWidth
                            autoComplete="off"
                            name="name"
                            onChange={handleChangeMajor}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Typography ml={1} mt={2.5}>
                            Giáo viên hướng dẫn
                        </Typography>
                        <div className="select_teacher">
                            <select defaultValue={"0"} className="format" id="format" onChange={handleChangeTeacher}>
                                <option value="0">Chọn giáo viên</option>
                                {teachers.map((option) => (
                                    <option key={option.id} value={option.id}>{option.email}</option>
                                ))}
                            </select>
                        </div>
                    </Grid>
                    <Grid item xs={9}>
                        <Typography ml={1} mt={2.5}>
                            Mô tả
                        </Typography>
                        <TextareaAutosize
                            minRows={3}
                            style={{ width: 500 }}
                            onChange={handleChangeDescription}
                        />
                    </Grid>
                </DialogContent>
                {errorText ? <Box className="error_add_period" sx={{ color: "error.main" }}>{errorText}</Box> : null}
                <DialogActions>
                    <Button onClick={handleCloseAddModal}>Hủy</Button>
                    <Button onClick={handleAdd}>Thêm</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                message={errorText}
            />
        </>
    );
}