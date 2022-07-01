import { Box, Button, TextField, useRadioGroup } from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RoundedButton from "../component/RoundedButton";
import * as Yup from "yup";

import {
  StyledContainer,
  FormWrapper,
  FormHeader,
  FormContent,
  FormActions,
  GoogleButton,
} from "../style";
import userApi from "../api/userApi";

export default function Login() {
  const navigate = useNavigate();
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    initialErrors: {
      email: "Vui lòng nhập Email",
      password: "Vui lòng nhập Password",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("Vui lòng nhập Email.")
        .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Email không hợp lệ."),
      password: Yup.string()
        .required("Vui lòng nhập Password.")
        .min(8, "Mật khẩu phải từ 8 tới 16 kí tự.")
        .max(16, "Mật khẩu phải từ 8 tới 16 kí tự."),
    }),
    onSubmit: async (values) => {
      const res = await userApi.login(values);
      if (res?.errors) {
        setError("Email hoặc mật khẩu không đúng!");
      } else if (res?.error) {
        setError("Email hoặc mật khẩu không đúng!");
      } else {
        setError("");
        localStorage.setItem("user", JSON.stringify(res));
        navigate("/", { replace: true });
      }
    },
  });

  return (
    <StyledContainer>
      <FormWrapper>
        <FormHeader>Đăng nhập</FormHeader>
        <FormContent onSubmit={formik.handleSubmit}>
          <TextField
            label="Email"
            margin="normal"
            fullWidth
            autoComplete="off"
            variant="standard"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={() => setErrorEmail(formik.errors?.email !== undefined)}
            onFocus={() => {
              setErrorEmail(false);
              setError("");
            }}
            error={formik.errors?.email != "" && errorEmail}
            helperText={
              formik.errors?.email != "" && errorEmail
                ? formik.errors.email
                : null
            }
          />
          <TextField
            label="Mật khẩu"
            margin="normal"
            fullWidth
            autoComplete="off"
            type="password"
            variant="standard"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={() =>
              setErrorPassword(formik.errors?.password !== undefined)
            }
            onFocus={() => {
              setErrorPassword(false);
              setError("");
            }}
            error={formik.errors?.password != "" && errorPassword}
            helperText={
              formik.errors?.password != "" && errorPassword
                ? formik.errors.password
                : null
            }
          />

          {error ? <Box sx={{ color: "error.main" }}>{error}</Box> : null}

          <FormActions>
            <RoundedButton
              variant="contained"
              type="submit"
              aria-label="Sign in"
              onClick={() => {
                setErrorEmail(formik.errors?.email !== undefined);
                setErrorPassword(formik.errors?.password !== undefined);
              }}
            >
              Đăng Nhập
            </RoundedButton>
            <div>hoặc</div>
            <GoogleButton
              variant="contained"
              color="error"
              type="button"
              aria-label="Google Sign in"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M7 11v2.4h3.97c-.16 1.029-1.2 3.02-3.97 3.02-2.39 0-4.34-1.979-4.34-4.42 0-2.44 1.95-4.42 4.34-4.42 1.36 0 2.27.58 2.79 1.08l1.9-1.83c-1.22-1.14-2.8-1.83-4.69-1.83-3.87 0-7 3.13-7 7s3.13 7 7 7c4.04 0 6.721-2.84 6.721-6.84 0-.46-.051-.81-.111-1.16h-6.61zm0 0 17 2h-3v3h-2v-3h-3v-2h3v-3h2v3h3v2z" />
              </svg>
              Google
            </GoogleButton>
          </FormActions>
        </FormContent>
      </FormWrapper>
    </StyledContainer>
  );
}
