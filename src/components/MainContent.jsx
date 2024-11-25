import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid2";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import FlareIcon from "@mui/icons-material/Flare";
import WbTwilightIcon from "@mui/icons-material/WbTwilight";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useTheme } from "@mui/material/styles";

import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Prayer from "./Prayer";
import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import "moment/dist/locale/ar";
moment.locale("ar");

export default function MainContent() {
    const [remainingTime, setRemainingTime] = useState("");
    const [nextPrayerIndex, setNextPrayerIndex] = useState(0);
    const [today, setToday] = useState("");
    const availableCities = [
        { displayName: "مكة المكرمة", apiName: "Makkah" },
        { displayName: "الرياض", apiName: "Riyadh" },
        { displayName: "الدمام", apiName: "Dammam" },
        { displayName: "جدة", apiName: "Jeddah" },
        { displayName: "المدينة المنورة", apiName: "Madinah" },
        { displayName: "الخبر", apiName: "Khobar" },
        { displayName: "القصيم", apiName: "Qassim" },
        { displayName: "الطائف", apiName: "Taif" },
        { displayName: "ابها", apiName: "Abha" },
        { displayName: "حائل", apiName: "Ha'il" },
        { displayName: "جازان", apiName: "Jazan" },
    ];

    const [selectedCity, setSelectedCity] = useState({
        displayName: "مكة المكرمة",
        apiName: "Makkah",
    }); //default city is Makkah

    const [timings, setTimings] = useState({
        Fajr: "",
        Dhuhr: "",
        Asr: "",
        Maghrib: "",
        Isha: "",
        Sunrise: "",
        Sunset: "",
    }); // Default values for times until values are fetched from API

    const prayersArray = [
        { key: "Fajr", displayName: "الفجر" },
        { key: "Dhuhr", displayName: "الظهر" },
        { key: "Asr", displayName: "العصر" },
        { key: "Maghrib", displayName: "المغرب" },
        { key: "Isha", displayName: "العشاء" },
    ];

    const getTimings = async () => {
        const response = await axios.get(
            `https://api.aladhan.com/v1/timingsByCity?country=SA&city=${selectedCity.apiName}`
        );
        setTimings(response.data.data.timings);
    };

    useEffect(() => {
        getTimings();
    }, [selectedCity]);

    useEffect(() => {
        const updateDate = () => {
            const todayDate = moment().format("MMM / Do / YYYY | h:mm:ss a");
            setToday(todayDate);
        };
        updateDate();

        const interval = setInterval(() => {
            updateDate();
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        let interval = setInterval(() => {
            setUpCountDownTimer();
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [timings]);

    const setUpCountDownTimer = () => {
        let momentNow = moment();
        let prayerIndex = null;
        if (
            momentNow.isAfter(moment(timings["Fajr"], "hh:mm:ss")) &&
            momentNow.isBefore(moment(timings["Dhuhr"], "hh:mm:ss"))
        ) {
            prayerIndex = 1;
        } else if (
            momentNow.isAfter(moment(timings["Dhuhr"], "hh:mm:ss")) &&
            momentNow.isBefore(moment(timings["Asr"], "hh:mm:ss"))
        ) {
            prayerIndex = 2;
        } else if (
            momentNow.isAfter(moment(timings["Asr"], "hh:mm:ss")) &&
            momentNow.isBefore(moment(timings["Maghrib"], "hh:mm:ss"))
        ) {
            prayerIndex = 3;
        } else if (
            momentNow.isAfter(moment(timings["Maghrib"], "hh:mm:ss")) &&
            momentNow.isBefore(moment(timings["Isha"], "hh:mm:ss"))
        ) {
            prayerIndex = 4;
        } else {
            prayerIndex = 0;
        }

        setNextPrayerIndex(prayerIndex);

        //setup countdown timer
        const nextPrayerObject = prayersArray[prayerIndex];
        const nextPrayerTime = timings[nextPrayerObject.key];

        let remainingTime = moment(nextPrayerTime, "hh:mm:ss").diff(momentNow);

        //exceptional case of the time remaining for Fajr prayer
        const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm:ss");
        if (remainingTime < 0) {
            const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
            const fajrToMidnightDiff = nextPrayerTimeMoment.diff(
                moment("00:00:00", "hh:mm:ss")
            );

            const totalDiff = midnightDiff + fajrToMidnightDiff;
            remainingTime = totalDiff;
        }

        const durationRemainingTime = moment.duration(remainingTime);
        setRemainingTime(
            `${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()}`
        );
    };

    const handleCityChange = (event) => {
        const cityObject = availableCities.find((city) => {
            return city.apiName === event.target.value;
        });
        setSelectedCity(cityObject);
    };

    const theme = useTheme();
    return (
        <Card
            sx={{
                width: { xs: 375, sm: 500, md: 800, lg: 1000, xl: 1400 },
                height: "550px",
                backgroundColor: theme.palette.primary.main,
            }}
        >
            <div style={{ position: "relative" }}>
                <CardMedia
                    sx={{
                        height: 150,
                        position: "relative",
                        zIndex: 1,
                    }}
                    image="/public/m10.png"
                />
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(255, 243, 237, 70%)",
                        zIndex: 2,
                    }}
                >
                    <CardContent sx={{ width: "100%", pt: 1 }}>
                        <Grid container alignItems="center">
                            <Grid size={12}>
                                <LocationOnIcon />
                                <FormControl
                                    variant="standard"
                                    sx={{ minWidth: 120 }}
                                >
                                    <Select
                                        labelId="demo-simple-select-standard-label"
                                        id="demo-simple-select-standard"
                                        value={selectedCity.apiName}
                                        onChange={handleCityChange}
                                        label="city"
                                    >
                                        {availableCities.map((city) => {
                                            return (
                                                <MenuItem
                                                    key={city.apiName}
                                                    value={city.apiName}
                                                >
                                                    {city.displayName}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid size={12}>
                                <Typography variant="h6">{today}</Typography>
                            </Grid>
                        </Grid>

                        <Grid container alignItems="center">
                            <Grid size={12}>
                                <Typography variant="h6">
                                    متبقي حتى صلاة{" "}
                                    {prayersArray[nextPrayerIndex].displayName}
                                </Typography>
                            </Grid>
                            <Grid size={12}>
                                <Typography variant="h6">
                                    {remainingTime}
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </div>
            </div>
            {/* ===================================================================== */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    textAlign: "center",
                    my: 2,
                }}
            >
                <Box
                    sx={{
                        background: "rgb(247 209 184)",
                        borderRadius: "10px",
                        minWidth: { xs: "120px", md: "300px", xl: "500px" },
                    }}
                >
                    <div>شروق الشمس</div>
                    <span>
                        {" "}
                        {moment(timings.Sunrise, "hh:mm:ss").format(
                            "h:mm A"
                        )}{" "}
                    </span>
                </Box>
                <Divider
                    orientation="vertical"
                    variant="middle"
                    flexItem
                    sx={{ backgroundColor: theme.palette.secondary.main }}
                />
                <Box
                    sx={{
                        background: "rgb(247 209 184)",
                        borderRadius: "10px",
                        minWidth: { xs: "120px", md: "300px", xl: "500px" },
                    }}
                >
                    <div>غروب الشمس</div>
                    <span>
                        {" "}
                        {moment(timings.Sunset, "hh:mm:ss").format(
                            "h:mm A"
                        )}{" "}
                    </span>
                </Box>
            </Box>
            {/* ===================================================================== */}

            <Stack sx={{ mt: 2 }} justifyContent="space-between">
                {prayersArray.map((prayer) => {
                    return (
                        <Prayer
                            key={prayer.key}
                            name={prayer.displayName}
                            time={moment(
                                timings[prayer.key],
                                "hh:mm:ss"
                            ).format("h:mm A")}
                            icon={
                                prayer.key === "Fajr" ? (
                                    <BedtimeIcon />
                                ) : prayer.key === "Dhuhr" ? (
                                    <WbSunnyIcon />
                                ) : prayer.key === "Asr" ? (
                                    <FlareIcon />
                                ) : prayer.key === "Maghrib" ? (
                                    <WbTwilightIcon />
                                ) : (
                                    <BedtimeIcon />
                                )
                            }
                        />
                    );
                })}
            </Stack>
        </Card>
    );
}