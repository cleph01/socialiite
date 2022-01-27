import React, { useState, forwardRef, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { useHistory } from "react-router-dom";
import { storage, db } from "../../services/firebase/firebase-config";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

import Divider from "@mui/material/Divider";

import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import AddPrize from "../my-shops/AddPrize";

import "../../lib/scss/components/my-shops/new-shop.scss";

function NewShop() {
    const history = useHistory();

    const { authUser } = useContext(UserContext);

    const [values, setValues] = useState({
        businessName: "",
        aboutUs: "",
        tags: "",
    });

    const [progress, setProgress] = useState(0);

    const [prizes, setPrizes] = useState([]);

    const [alertMsg, setAlertMsg] = useState({
        message: "",
        severity: "",
    });

    const [openSnackBar, setOpenSnackBar] = useState(false);

    const handleChange = (name) => (event) => {
        setValues({ ...values, [name]: event.target.value });
    };

    const Alert = forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const handleCloseSnackBar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpenSnackBar(false);
    };

    const handleSubmit = () => {
        if (values.businessName || values.aboutUs) {
            if (prizes.length === 0) {
                setAlertMsg({
                    message: "Must Include 1 Prize Minimum",
                    severity: "error",
                });
                setOpenSnackBar(true);
            } else {
                db.collection("shops")
                    .add({
                        businessName: values.businessName,
                        aboutUs: values.aboutUs,
                        logoUrl: "",
                        address: "",
                        city: "",
                        state: "",
                        googlePlaceId: "",
                        likes: [],
                        lat: null,
                        lon: null,
                        phone: "",
                        subscribed: true,
                        tags: values.tags.toLowerCase().split(" "),
                        ownerId: authUser.uid,
                    })
                    .then((docRef) => {
                        prizes.forEach((prize) => {
                            db.collection("prizes")
                                .add({
                                    businessId: docRef.id,
                                    description: prize.description,
                                    emoji: prize.emoji,
                                    incentive: prize.incentive,
                                    pointCost: prize.pointCost,
                                    tags: prize.tags,
                                })
                                .then((prizeRef) => {
                                    console.log(
                                        "new shop created with Id: ",
                                        prizeRef.id
                                    );
                                })
                                .catch((error) => {
                                    console.log(
                                        "Error Creating New Shop: ",
                                        error
                                    );
                                    setAlertMsg({
                                        message: "Shop Creation Failed",
                                        severity: "error",
                                    });
                                    setOpenSnackBar(true);
                                });
                        });

                        setAlertMsg({
                            message: "New Shop Created Successfully",
                            severity: "success",
                        });
                        setOpenSnackBar(true);
                    })
                    .catch((error) => {
                        console.log("Error Creating New Shop: ", error);
                        setAlertMsg({
                            message: "Shop Creation Failed",
                            severity: "error",
                        });
                        setOpenSnackBar(true);
                    });
            }
        } else {
            setAlertMsg({
                message: "Fields Cannot Be Blank",
                severity: "error",
            });
            setOpenSnackBar(true);
        }
    };

    console.log("Prizes: ", prizes);

    return (
        <div className="new-shop-container">
            <Card className="card-wrapper">
                <CardContent>
                    <div className="new-shop-header">
                        <Typography variant="h5">New Shop</Typography>

                        <br />
                        <TextField
                            id="handle"
                            label="Shop Name"
                            value={values.businessName}
                            onChange={handleChange("businessName")}
                            margin="normal"
                            className="input"
                        />
                        <br />
                        <TextField
                            id="bio"
                            label="About Us"
                            value={values.aboutUs}
                            onChange={handleChange("aboutUs")}
                            margin="normal"
                            className="input"
                            multiline
                        />
                        <TextField
                            id="tags"
                            label="Business Tags"
                            value={values.tags}
                            onChange={handleChange("tags")}
                            margin="normal"
                            className="input"
                            multiline
                        />
                        <AddPrize
                            prizes={prizes}
                            setPrizes={setPrizes}
                            setAlertMsg={setAlertMsg}
                            setOpenSnackBar={setOpenSnackBar}
                        />
                    </div>
                </CardContent>
                <center>
                    <div className="btn-wrapper">
                        <div className="submit-btn" onClick={handleSubmit}>
                            Submit
                        </div>
                        <div
                            className="cancel-btn"
                            onClick={() => history.push("/hero/my-shops")}
                        >
                            Cancel
                        </div>
                    </div>
                </center>
            </Card>
            <Stack spacing={2} sx={{ width: "100%" }}>
                <Snackbar
                    open={openSnackBar}
                    autoHideDuration={3000}
                    onClose={handleCloseSnackBar}
                >
                    <Alert
                        onClose={handleCloseSnackBar}
                        severity={alertMsg.severity}
                        sx={{ width: "100%" }}
                    >
                        {alertMsg.message}
                    </Alert>
                </Snackbar>
            </Stack>
        </div>
    );
}

export default NewShop;
