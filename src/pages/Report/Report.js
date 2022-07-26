import React, { useEffect, useState } from "react";
import PeriodApi from "../../api/PeriodApi";
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
import ReportItemsList from "./ReportItemsList";
import ReportApi from "../../api/ReportApi";


export default function Report() {

    const [periods, setPeriods] = useState([]);
    const [selectedPeriod, setSelectedPeriod] = useState("0");
    const [isAdmin, setIsAdmin] = useState(false);

    const [errorText, setErrorText] = useState("");

    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
        setErrorText("");
    }

    useEffect(() => {
        InitPeriodList();
        InitRole();
    }, [selectedPeriod]);

    function InitRole() {
        const item = JSON.parse(localStorage.getItem('user'));
        if (item) {
            setIsAdmin(item.role==="Admin"?true:false);
        }
    }

    function handleChangePeriod(event) {
        if (event.target.value !== "0") {
            setSelectedPeriod(event.target.value);
        }
        else {
            setSelectedPeriod("0");
        }
    }

    async function InitPeriodList() {
        let periodsList = await (await PeriodApi.GetPeriodList()).data;
        setPeriods(periodsList);
    }

    async function handleExport(){
        if(selectedPeriod === "0"){
            setErrorText("Bạn chưa chọn đợt đăng kí");
            setOpenSnackbar(true);
        }
        else{
            let check =  await ReportApi.GetReportInPeriod({id: selectedPeriod});
            if(check.status === 200 && check.data.length > 0){
                let res = await ReportApi.DownReportInPeriod({id: selectedPeriod});
                if(res.status === 200){
                    setErrorText("Báo cáo đã được tải xuống");
                    setOpenSnackbar(true);
                }
            }
            else{
                setErrorText("Danh sách báo cáo rỗng");
                setOpenSnackbar(true);
            }
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
                {isAdmin ?
                    <div className="addzone">
                        <Button onClick={handleExport} className="btn_add_student" variant="outlined" color="primary">Xuất báo cáo</Button>
                    </div> : <div></div>}
                <div className="student_data_table">
                    <ReportItemsList id={selectedPeriod} ></ReportItemsList>
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