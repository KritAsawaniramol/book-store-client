import { Typography } from "@mui/material";

export default function ErrorUnauthorizedPage() {
  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <Typography>{"Sorry, you don't have permission to access this page."}</Typography>
    </div>
  );
}