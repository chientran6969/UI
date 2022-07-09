import React, { useEffect, useState } from "react";
import PeriodStudentApi from "../../../api/PeriodStudentApi";
import {
    Button,
    TextField,
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
    Input,
    Box,
    Snackbar
} from '@mui/material';
import "./PeriodStudent.css";
import StudentList from "./StudentList";

export default function PeriodStudent() {

    const [periods, setPeriods] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedPeriod, setSelectedPeriod] = useState("");

    //Snackbar
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [errorNormalText, setErrorNormalText] = useState("");
    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
        setErrorNormalText("");
    };

    // Modal
    const [openAddModal, setOpenAddModal] = useState(false);
    const handleOpenAddModal = () => {
        if (selectedPeriod !== "") {
            setStudentAdded("");
            setOpenAddModal(true);
        } else {
            setOpenSnackbar(true);
            setErrorNormalText("Bạn chưa chọn đợt");
        }
    }
    const handleCloseAddModal = () => {
        setOpenAddModal(false);
        setStudentAdded("");
        setErrorTextAdd("");
    }
    const [openAddModalByCsv, setOpenAddModalByCsv] = useState(false);
    const handleOpenAddModalByCsv = () => {
        if (selectedPeriod !== "") {
            setStudentAddedFile(undefined);
            setOpenAddModalByCsv(true);
        } else {
            setOpenSnackbar(true);
            setErrorNormalText("Bạn chưa chọn đợt");
        }
    };
    const handleCloseAddModalByCsv = () => {
        setOpenAddModalByCsv(false);
        setStudentAddedFile(undefined);
        setErrorTextAdd("");
    };

    // Add
    const [studentAdded, setStudentAdded] = useState("");
    const [errorTextAdd, setErrorTextAdd] = useState("");

    const [studentAddedFile, setStudentAddedFile] = useState();
    
    const handleOnChangeTextFieldAdd = (e) => {
        setStudentAdded(e.target.value);
    };

    const handleInputFileChange =(e) =>{
        if(e.target.files[0].type !== "text/csv"){
            setErrorTextAdd("Định dạng file không được hỗ trợ");
        }else{
            setStudentAddedFile(e.target.files[0]);
            setErrorTextAdd("");
        }
    }

    async function handleAddStudent() {
        if (studentAdded !== '') {
            let data = {
                PeriodId: selectedPeriod,
                StudentId: studentAdded
            }

            let response = await PeriodStudentApi.AddPeriodStudent(data);
            if (response.status === 201) {
                let s = {
                    id: GetId(),
                    MSSV: studentAdded
                }

                setStudents([...students, s]);

                handleCloseAddModal();
            }
            else if (response.status === 400) {
                setStudentAdded("");
                setErrorTextAdd(response.error);
            }
        }
        else {
            setErrorTextAdd("Bạn chưa nhập MSSV");
        }
    };

    function GetId(){
        let max = 0;
        students.forEach((i) =>{
            if(i.id > max){
                max = i.id;
            }
        })
        return max+1;
    }

    async function handleAddStudentByCsv(){
        if(errorTextAdd === "" && studentAddedFile){
            let data = {
                PeriodId: selectedPeriod,
                File: studentAddedFile
            };

            let res = await PeriodStudentApi.AddPeriodStudentByCsv(data);
            if(res.status === 200){
                handleCloseAddModalByCsv();
                let array = [];
                res.data.forEach((item, index)=>{
                    array.push({
                        id: index +1,
                        MSSV: item.studentId
                    });
                });
                setStudents(array);
            }
            else{
                setOpenSnackbar(true);
                setErrorNormalText(res.error);
                handleCloseAddModalByCsv();
            }
        }
        else{
            setOpenSnackbar(true);
            setErrorNormalText("File đang không đúng định dạng");
        }
    };

    useEffect(() => {
        InitPeriodList();
    }, []);

    async function InitPeriodList() {
        let periodsList = await (await PeriodStudentApi.GetPeriodList()).data;
        setPeriods(periodsList);
    }

    async function InitPeriodStudentList(periodId) {
        let data = {
            periodId: periodId
        };
        let studentList = await PeriodStudentApi.GetListStudentByPeriod(data);
        if (studentList.length > 0) {
            let rowStudentList = [];
            for (let i = 1; i <= studentList.length; i++) {
                rowStudentList.push({
                    id: i,
                    MSSV: studentList.data[i - 1].studentId
                });
            }
            setStudents(rowStudentList);
        }
        else {
            setStudents([]);
        }
    }

    function handleChange(event) {
        if (event.target.value !== "0") {
            setSelectedPeriod(event.target.value);
            InitPeriodStudentList(event.target.value);
        }
        else {
            setStudents([]);
            setSelectedPeriod("");
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
                <div className="addzone">
                    <Button className="btn_add_student" variant="outlined" color="primary" onClick={handleOpenAddModal}>Thêm sinh viên</Button>
                            <span>    </span>
                    <Button className="btn_add_student" variant="outlined" color="primary" onClick={handleOpenAddModalByCsv}>Thêm Sinh viên bằng file CSV</Button>
                </div>
                <div className="student_data_table">
                    <StudentList rows={students} period={selectedPeriod} />
                </div>
            </div>
            <Dialog open={openAddModal} onClose={handleCloseAddModal}>
                <DialogTitle>Thêm sinh viên</DialogTitle>
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
                {errorTextAdd ? <Box className="error_add_student" sx={{ color: "error.main" }}>{errorTextAdd}</Box> : null}
                <DialogActions>
                    <Button onClick={handleCloseAddModal}>Hủy</Button>
                    <Button onClick={handleAddStudent}>Thêm</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openAddModalByCsv} onClose={handleCloseAddModalByCsv}>
                <DialogTitle>Thêm sinh viên</DialogTitle>
                <DialogContent>
                    <Input
                        autoFocus
                        margin="dense"
                        id="mssv"
                        label="MSSV"
                        type="file"
                        fullWidth
                        variant="standard"
                        onChange={handleInputFileChange}
                    />
                </DialogContent>
                {errorTextAdd ? <Box className="error_add_student" sx={{ color: "error.main" }}>{errorTextAdd}</Box> : null}
                <DialogActions>
                    <Button onClick={handleCloseAddModalByCsv}>Hủy</Button>
                    <Button onClick={handleAddStudentByCsv}>Thêm</Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                message={errorNormalText}
            />
        </>
    );
}