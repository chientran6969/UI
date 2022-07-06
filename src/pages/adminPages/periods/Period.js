import { Box, Button, Card, Typography } from "@mui/material";

export default function Period() {
  return (
    <Card
      sx={{ display: "flex", justifyContent: "space-between", mb: 2, p: 2 }}
    >
      <Box textAlign="left" ml={2}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          ten
        </Typography>
        <Box>from - to</Box>
      </Box>
      <Box mt={2}>
        <Button variant="contained" sx={{ mr: 2 }}>
          Chi tiết
        </Button>
        <Button variant="contained" color="warning" sx={{ mr: 2 }}>
          Sửa
        </Button>
        <Button variant="contained" color="error">
          Xóa
        </Button>
      </Box>
    </Card>
  );
}
