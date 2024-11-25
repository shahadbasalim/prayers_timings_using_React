import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

export default function Prayer({ name, time, icon }) {
    const theme = useTheme();

    return (
        <Card
            sx={{
                minWidth: 275,
                border: `1px solid ${theme.palette.secondary.main}`,
                mt: 1,
                mx: 2,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: "10px",
                }}
            >
                <Typography variant="h5" component="div">
                    {name}
                </Typography>
                <Box
                    sx={{
                        color: theme.palette.secondary.main,
                    }}
                >
                    <Box
                        sx={{
                            display: "inline-flex",
                            fontWeight: "bold",
                            fontSize: "18px",
                            textAlign: "right",
                            width: "63px"
                        }}
                    >
                        {time}
                    </Box>
                    <Box
                        sx={{
                            display: "inline",
                            mr: "10px",
                        }}
                    >
                        {icon}
                    </Box>
                </Box>
            </Box>
        </Card>
    );
}
