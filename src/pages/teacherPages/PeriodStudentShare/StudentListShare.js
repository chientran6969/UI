import React, { useEffect, useState } from "react";
import {
    Box,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

export default function StudentListShare({ rows, period }) {

    const [students, setStudents] = useState([]);

    useEffect(() =>{
        setStudents(rows);
    },[rows]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'MSSV',
            headerName: 'MSSV',
            width: 500,
            editable: true,
        }
        
    ];

    return (
        <>
            <Box sx={{ height: 400, width: '50%' }}>
                <DataGrid
                    rows={students}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                />
            </Box>
        </>
    );
}