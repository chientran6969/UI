import React, { useEffect, useState } from "react";
import {
    Snackbar
} from "@mui/material";
import "./PeriodTopicShare.css";
import PeriodApi from "../../../api/PeriodApi";
import PeriodTopicApi from "../../../api/PeriodTopicApi";
import TopicApi from "../../../api/TopicApi";
import userApi from "../../../api/userApi";
import TopicListShare from "./TopicListShare";


export default function PeriodTopicShare() {

    const [periods, setPeriods] = useState([]);
    const [topics, setTopics] = useState([]);
    const [selectedPeriod, setSelectedPeriod] = useState("0");
    const [periodTopics, setPeriodTopics] = useState([]);
    const [teachers, setTeachers] = useState([]);
    

    const [errorText, setErrorText] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    }

    useEffect(() => {
        InitPeriodList();
        InitTeacherList();
        InitTopics();
    }, [selectedPeriod]);

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
                
                <div className="student_data_table">
                    <TopicListShare rows={periodTopics} teachers={teachers}></TopicListShare>
                </div>
            </div>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                message={errorText}
            />
        </>
    );
}