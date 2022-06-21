import { Paper } from "@mui/material";
import { spacing } from "@mui/system";
import axios, * as others from "axios";
import Cookies from "js-cookie";

export default function Home() {
  axios
    .get("https://jsonplaceholder.typicode.com/posts/1")
    .then((res) => {
      console.log(res);
      Cookies.set("foo", "bar");
    })
    .catch((error) => console.log(error));

  return (
    <div>
      <Paper sx={{ mx: 30, mb: 5 }}>Home </Paper>
      <Paper sx={{ mx: 30, mb: 5 }}>Home </Paper>
      <Paper sx={{ mx: 30, mb: 5 }}>Home </Paper>
    </div>
  );
}
