import { Box, Paper } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";

function GitHubPager(props: { url: string }) {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: { xs: 8, sm: 16 },
        right: { xs: 8, sm: 16 },
        zIndex: 10,
      }}
    >
      <Paper
        component="a"
        href={props.url}
        target="_blank"
        rel="noopener noreferrer"
        elevation={2}
        sx={{
          display: "flex",
          alignItems: "center",
          p: 1,
          borderRadius: 10,
          bgcolor: "background.paper",
          color: "text.secondary",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            bgcolor: "action.hover",
            color: "text.primary",
            boxShadow: 4,
          },
          textDecoration: "none",
        }}
      >
        <GitHubIcon />
      </Paper>
    </Box>
  );
}

export default GitHubPager;
