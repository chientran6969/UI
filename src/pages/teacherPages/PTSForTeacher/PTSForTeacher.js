import React, { useEffect, useState } from "react";
import {
    Snackbar,
} from "@mui/material";
import PeriodApi from "../../../api/PeriodApi";
import PeriodTopicApi from "../../../api/PeriodTopicApi";
import PeriodTopicStudentApi from "../../../api/PeriodTopicStudentApi";
import PTSListForTeacher from "./PTSListForTeacher";


export default function PTSForTeacher() {

    const [periods, setPeriods] = useState([]);
    const [selectedPeriod, setSelectedPeriod] = useState("0");
    const [periodTopics, setPeriodTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState("0");
    const [pts, setPts] = useState([]);

    const [errorText, setErrorText] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    }

    useEffect(() => {
        InitPeriodList();
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

    function handleChangeTopic(event) {
        if (event.target.value !== "0") {
            setSelectedTopic(event.target.value);
            InitPTSList(event.target.value);
        }
        else {
            setSelectedTopic("0");
        }
    }

    async function InitPTSList(topic) {
        let data = {
            periodTopicId: topic,
        }
        let res = await PeriodTopicStudentApi.GetPTS(data);
        if (res.status === 200) {
            setPts(res.data);
        } else {
            setErrorText(res.error);
            setOpenSnackbar(true);
        }
    }


    async function InitPeriodTopicList(period) {
        let data = {
            PeriodId: period,
        };
        let res = await PeriodTopicApi.GetTopicInPeriodByTeacher(data);
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
                <div className="select">
                    <select onChange={handleChangeTopic} defaultValue={"0"} className="format" id="format">
                        <option value="0">Chọn đề tài</option>
                        {periodTopics.map((option) => (
                            <option key={option.id} value={option.id}>{option.topic.name}</option>
                        ))}
                    </select>
                </div>
                <div className="student_data_table">
                    <PTSListForTeacher
                        period={selectedPeriod}
                        rows={pts}>
                    </PTSListForTeacher>
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