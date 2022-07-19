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
    Snackbar,
    TextareaAutosize
} from "@mui/material";
import "./PeriodTopic.css";
import PeriodApi from "../../../api/PeriodApi";
import PeriodTopicApi from "../../../api/PeriodTopicApi";
import TopicApi from "../../../api/TopicApi";
import userApi from "../../../api/userApi";
import TopicList from "./TopicList";


export default function PeriodTopic() {

    const dataRaw = {
        topicName: "",
        major: "",
        maxRegister: 0,
        maxMember: 0,
        teacher: "",
        description: ""
    }

    const [periods, setPeriods] = useState([]);
    const [topics, setTopics] = useState([]);
    const [selectedPeriod, setSelectedPeriod] = useState("0");
    const [selectedTopic, setSelectedTopic] = useState("0");
    const [dataAdd, setDataAdd] = useState(dataRaw);
    const [periodTopics, setPeriodTopics] = useState([]);
    const [teachers, setTeachers] = useState([]);
    // Modal
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openAddModalOld, setOpenAddModalOld] = useState(false);

    const [errorText, setErrorText] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    }

    const handleOpenAddModal = () => {
        if (selectedPeriod !== "0") {
            setOpenAddModal(true);
            setErrorText("");
            setDataAdd(dataRaw);
        }
        else {
            setErrorText("Chưa chọn đợt đăng kí");
            setOpenSnackbar(true);
        }
    };

    const handleCloseAddModal = () => {
        setOpenAddModal(false);
        setDataAdd(dataRaw);
    };

    const handleOpenAddModalOld = () => {
        if (selectedPeriod !== "0") {
            setOpenAddModalOld(true);
            setErrorText("");
            setDataAdd(dataRaw);
        }
        else {
            setErrorText("Chưa chọn đợt đăng kí");
            setOpenSnackbar(true);
        }
    };

    const handleCloseAddModalOld = () => {
        setOpenAddModalOld(false);
        setDataAdd(dataRaw);
    };

    useEffect(() => {
        InitPeriodList();
        InitTeacherList();
        InitTopics();
    }, [selectedPeriod]);


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

    const handleChangeMaxRegister = (e) => {
        let data = dataAdd;
        data.maxRegister = e.target.value;
        setDataAdd(data);
    };

    const handleChangeMaxMember = (e) => {
        let data = dataAdd;
        data.maxMember = e.target.value;
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
            InitPeriodTopicList(event.target.value);
        }
        else {
            setPeriodTopics([]);
            setSelectedPeriod("0");
        }
    }

    function handleChangeTopic(event) {
        if (event.target.value !== "0") {
            setSelectedTopic(event.target.value);
        }
        else {
            setSelectedTopic("0");
        }
    }

    async function InitTopics(){
        let res = await TopicApi.GetTopicList();
        if (res.status === 200){
            setTopics(res.data);
        }
    }

    async function InitTeacherList() {
        let res = await userApi.GetTeacherList();
        if (res.status === 200) {
            setTeachers(res.data);
        }
    }

    async function InitPeriodTopicList(period) {
        let data = {
            PeriodId: period
        };

        let res = await PeriodTopicApi.GetTopicInPeriod(data);
        if (res.status === 200) {
            setPeriodTopics(res.data);
        }
    }

    async function InitPeriodList() {
        let periodsList = await (await PeriodApi.GetPeriodList()).data;
        setPeriods(periodsList);
    }

    async function handleAddNew() {
        if (dataAdd.topicName === ""
            || dataAdd.major === ""
            || dataAdd.teacher === "0"
            || dataAdd.description === "") {
            setErrorText("Chưa nhập đủ thông tin");
        }
        else if (dataAdd.maxRegister > 10) {
            setErrorText("Số lượng đăng kí tối đa phải nhỏ hơn 10");
        }
        else if (dataAdd.maxmember > 3) {
            setErrorText("Số lượng thành viên không được vượt quá 3");
        }
        else if (dataAdd.maxRegister <= 0
            || dataAdd.maxMember <= 0) {
            setErrorText("Đề tài tối đa và số lượng thành viên tối đa phải lớn hơn 0");
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

    async function handleAddOld() {
        if (dataAdd.teacher === "0"
            || selectedTopic === "0") {
            setErrorText("Chưa nhập đủ thông tin");
        }
        else if (dataAdd.maxRegister > 10) {
            setErrorText("Số lượng đăng kí tối đa phải nhỏ hơn 10");
        }
        else if (dataAdd.maxMember > 3) {
            setErrorText("Số lượng thành viên không được vượt quá 3");
        }
        else if (dataAdd.maxRegister <= 0
            || dataAdd.maxMember <= 0) {
            setErrorText("Đề tài tối đa và số lượng thành viên tối đa phải lớn hơn 0");
        }
        else {
            let data = {
                id: selectedTopic
            };
            handleAddPeriodTopicOld(data);
        }
    }

    async function handleAddPeriodTopic(data) {
        let input = {
            periodId: selectedPeriod,
            topicId: data.id,
            teacherId: dataAdd.teacher,
            maxRegister: dataAdd.maxRegister,
            maxMember: dataAdd.maxMember
        }
        let res = await PeriodTopicApi.AddPeriodTopic(input);
        if (res.status === 200) {
            InitPeriodTopicList(selectedPeriod);
            handleCloseAddModal();
        }
        else if (res.status === 400) {
            let d = {
                id: data.id
            };
            await TopicApi.DeleteTopic(d);
        }

    }

    async function handleAddPeriodTopicOld(data) {
        let input = {
            periodId: selectedPeriod,
            topicId: data.id,
            teacherId: dataAdd.teacher,
            maxRegister: dataAdd.maxRegister,
            maxMember: dataAdd.maxMember
        }
        let res = await PeriodTopicApi.AddPeriodTopic(input);
        if (res.status === 200) {
            InitPeriodTopicList(selectedPeriod);
            handleCloseAddModalOld();
        }
        else if (res.status === 400) {
            setErrorText(res.error);
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
                    <Button onClick={handleOpenAddModal} className="btn_add_student" variant="outlined" color="primary">Thêm đề tài mới</Button>
                    <Button onClick={handleOpenAddModalOld} className="btn_add_student" variant="outlined" color="primary">Thêm đề tài đã có</Button>
                </div>
                <div className="student_data_table">
                    <TopicList rows={periodTopics} teachers={teachers}></TopicList>
                </div>
            </div>

            <Dialog
                fullWidth={true}
                maxWidth={'sm'}
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
                            Số lượng đăng kí tối đa
                        </Typography>
                        <Input
                            type="number"
                            required
                            fullWidth
                            autoComplete="off"
                            onChange={handleChangeMaxRegister}
                        ></Input>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography ml={1} mt={2.5}>
                            Số lượng thành viên tối đa trong nhóm đăng kí
                        </Typography>
                        <Input
                            type="number"
                            required
                            fullWidth
                            autoComplete="off"
                            onChange={handleChangeMaxMember}
                        ></Input>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography ml={1} mt={2.5}>
                            Giáo viên hướng dẫn
                        </Typography>
                        <div className="select_teacher">
                            <select defaultValue={"0"} className="format" id="format" onChange={handleChangeTeacher} >
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
                    <Button onClick={handleAddNew}>Thêm</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                fullWidth={true}
                maxWidth={'sm'}
                open={openAddModalOld}
                onClose={handleCloseAddModalOld}>
                <DialogTitle>Thêm đề tài mới</DialogTitle>
                <DialogContent>
                    <Grid item xs={6}>
                        <Typography ml={1} mt={2.5}>
                            Chọn đề tài
                        </Typography>
                        <div className="select_teacher">
                            <select defaultValue={"0"} className="format" id="format" onChange={handleChangeTopic} >
                                <option value="0">Chọn đề tài</option>
                                {topics.map((option) => (
                                    <option key={option.id} value={option.id}>{option.name}</option>
                                ))}
                            </select>
                        </div>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography ml={1} mt={2.5}>
                            Số lượng đăng kí tối đa
                        </Typography>
                        <Input
                            type="number"
                            required
                            fullWidth
                            autoComplete="off"
                            onChange={handleChangeMaxRegister}
                        ></Input>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography ml={1} mt={2.5}>
                            Số lượng thành viên tối đa trong nhóm đăng kí
                        </Typography>
                        <Input
                            type="number"
                            required
                            fullWidth
                            autoComplete="off"
                            onChange={handleChangeMaxMember}
                        ></Input>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography ml={1} mt={2.5}>
                            Giáo viên hướng dẫn
                        </Typography>
                        <div className="select_teacher">
                            <select defaultValue={"0"} className="format" id="format" onChange={handleChangeTeacher} >
                                <option value="0">Chọn giáo viên</option>
                                {teachers.map((option) => (
                                    <option key={option.id} value={option.id}>{option.email}</option>
                                ))}
                            </select>
                        </div>
                    </Grid>
                </DialogContent>
                {errorText ? <Box className="error_add_period" sx={{ color: "error.main" }}>{errorText}</Box> : null}
                <DialogActions>
                    <Button onClick={handleCloseAddModalOld}>Hủy</Button>
                    <Button onClick={handleAddOld}>Thêm</Button>
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