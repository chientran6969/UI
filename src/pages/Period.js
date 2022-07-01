import { Paper, Typography } from "@mui/material";
import { spacing } from "@mui/system";
import { typography } from "@mui/system";

export default function Period() {
  return (
    <div>
      <Paper style={{ maxWidth: "800px" }} sx={{ p: 2, textAlign: "left" }}>
        <Typography sx={{ fontWeight: "medium", fontSize: 16 }}>
          HK2 2019
        </Typography>
        <div>from - to</div>
      </Paper>
    </div>
  );
}
