import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
    Snackbar
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import ReportApi from "../../api/ReportApi";

export default function ReportItemsList({ id }) {

    const [items, setItems] = useState([]);

    useEffect(() => {
        InitListReport();
    },[id]);

    async function InitListReport() {
        if(id !== "0"){
            let res = await ReportApi.GetReportInPeriod({id: id});
            if (res.status === 200) {
                let data = [];

                res.data.forEach((d, index) => {
                    let i = {
                        id: index +1,
                        teacherEmail: d.teacherEmail,
                        topicName: d.topicName,
                        major: d.major,
                        studentAssigns: d.studentsCount,
                        studentId1: d.studentId1,
                        studentId2: d.studentId2,
                        studentId3: d.studentId3
                    }

                    data.push(i);
                });

                setItems(data);
            }
        }
    }

    const columns = [
        { field: 'id', headerName: 'STT', width: 90 },
        {
            field: 'teacherEmail',
            headerName: 'Giáo viên',
            width: 200,
        },
        {
            field: 'topicName',
            headerName: 'Tên đề tài',
            width: 300,
        },
        {
            field: 'major',
            headerName: 'Chuyên ngành',
            width: 200,
        },
        {
            field: 'studentAssigns',
            headerName: 'Số lượng sinh viên',
            width: 200,
        },
        {
            field: 'studentId1',
            headerName: 'Sinh viên 1',
            width: 200,
        },
        {
            field: 'studentId2',
            headerName: 'Sinh viên 2',
            width: 200,
        },
        {
            field: 'studentId3',
            headerName: 'Sinh viên 3',
            width: 200,
        },
    ];

    return (
        <>
            <Box sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={items}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                />
            </Box>
        </>
    );
}