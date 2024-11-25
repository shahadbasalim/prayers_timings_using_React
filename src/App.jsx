import "./App.css";
import MainContent from "./components/MainContent";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
    typography: {
        fontFamily: ["Tajawal"],
    },
    palette: {
        primary: {
            main: "rgb(255, 243, 237)",
        },
        secondary: {
            main: "rgb(238 118 51)",
        },
        background: {
            default: "#F5F5F5",
        },
    }

});
function App() {
    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    my: 3,
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Container maxWidth="xl">
                    <MainContent />
                </Container>
            </Box>
        </ThemeProvider>
    );
}

export default App;
