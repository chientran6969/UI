import React, { useEffect, useState } from "react";
import PeriodStudentApi from "../../../api/PeriodStudentApi";
import {
    Snackbar
} from '@mui/material';
import "./PeriodStudentShare.css";
import StudentListShare from "./StudentListShare";

export default function PeriodStudentShare() {

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
                
                <div className="student_data_table">
                    <StudentListShare rows={students} period={selectedPeriod} />
                </div>
            </div>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                message={errorNormalText}
            />
        </>
    );
}