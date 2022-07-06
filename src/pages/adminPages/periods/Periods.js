import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";
import { useState } from "react";
import { FormContent } from "../../../style";
import Period from "./Period";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function Periods() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      fromDate: new Date(),
      endDate: new Date(),
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Vui lòng nhập tên đợt đăng ký"),
      fromDate: Yup.date().min(
        Yup.ref(new Date().toString()),
        () => "Không được chọn ngày đã qua"
      ),
      endDate: Yup.date()
        .min(
          Yup.ref(new Date().toString()),
          () => "Không được chọn ngày đã qua"
        )
        .min(Yup.ref("fromDate"), () => "Phải chọn ngày bằng hoặc sau ngày mở"),
    }),
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  return (
    <Container maxWidth="lg">
      <Grid sx={{ display: "grid" }}>
        <Card
          sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
          style={{
            textAlign: "left",
            backgroundSize: "cover",
            height: "150px",
            backgroundRepeat: "no-repeat",
            backgroundImage: `url("https://gstatic.com/classroom/themes/img_bookclub.jpg")`,
            color: "white",
          }}
        >
          <Typography sx={{ mt: 11, ml: 4 }} variant="h4" component="div">
            Danh sách đợi đăng ký
          </Typography>
          <Button
            sx={{ mt: 11, mr: 4, mb: 2 }}
            variant="contained"
            onClick={handleClickOpen}
          >
            Thêm mới
          </Button>
        </Card>
        <Period />
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <div>Thêm mới đợi đăng ký</div>
        </DialogTitle>
        <FormContent onSubmit={formik.handleSubmit}>
          <DialogContent dividers>
            <Grid container rowSpacing={2}>
              <Grid item xs={3}>
                <Typography ml={1} mt={2.5}>
                  Tên đợt:
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField
                  required
                  label="Tên đợi đăng ký"
                  fullWidth
                  autoComplete="off"
                  name="name"
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={3}>
                <Typography ml={1} mt={2.5}>
                  Ngày mở:
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    label="Ngày mở đợt đăng kí"
                    name="fromDate"
                    renderInput={(props) => <TextField {...props} fullWidth />}
                    value={formik.values.fromDate}
                    onChange={formik.handleChange}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={3}>
                <Typography ml={1} mt={2.5}>
                  Ngày kết thúc:
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    label="Ngày kết thúc đợt đăng kí"
                    name="endDate"
                    renderInput={(props) => <TextField {...props} fullWidth />}
                    value={formik.values.endDate}
                    onChange={formik.handleChange}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleClose}>
              Hủy
            </Button>
            <Button variant="contained" type="submit">
              Thêm
            </Button>
          </DialogActions>
        </FormContent>
      </Dialog>
    </Container>
  );
}
