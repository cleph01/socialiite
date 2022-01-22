import React, { useState, useEffect, forwardRef } from "react";
import { useHistory, useParams } from "react-router-dom";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

import Divider from "@mui/material/Divider";

import Skeleton from "@mui/material/Skeleton";

import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import NewShopLogoUpload from "../my-shops/NewShopLogoUpload";
import EditPrizeList from "./EditPrizeList";
import AddPrize from "./AddPrize";

import { db } from "../../services/firebase/firebase-config";

import "../../lib/scss/components/my-shops/edit-shop.scss";

function EditShop() {
    const history = useHistory();

    const { businessId } = useParams();

    const [business, setBusiness] = useState();

    const [prizes, setPrizes] = useState([]);

    console.log("businessId: ", businessId);

    const [values, setValues] = useState({
        businessName: "",
        aboutUs: "",
        logoUrl: "",
    });

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

    const submitPrize = () => {
        if (prizes.length === 0) {
            setAlertMsg({
                message: "Prizes Can't Be Empty",
                severity: "error",
            });

            setOpenSnackBar(true);
        } else {
            prizes.forEach((prize) => {
                db.collection("prizes")
                    .add(prize)
                    .then((docId) => {
                        console.log("New Prize Added w Id: ", docId);
                    })
                    .catch((error) => {
                        console.log("Error Adding Prize: ", error);
                    });
            });
        }
    };

    useEffect(() => {
        db.collection("shops")
            .doc(businessId)
            .get()
            .then((doc) => {
                setBusiness({ businessId: businessId, ...doc.data() });
            })
            .catch((error) => {
                console.log("Error getting business info: ", error);
            });
    }, []);

    if (!business) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "10px",
                }}
                className="hero-home__container"
            >
                <Skeleton variant="rectangular" width={350} height={218} />
            </div>
        );
    }

    return (
        <div className="new-shop-container">
            <Card className="card-wrapper">
                <CardContent>
                    <Typography variant="h4">Edit Shop</Typography>
                    <div className="edit-shop-header">
                        <br />
                        <Typography variant="h5">
                            {business.businessName}
                        </Typography>
                        <NewShopLogoUpload />
                        <Divider sx={{ width: "100%" }} />
                        <div className="logo-header">
                            <Typography variant="h5">Current Logo:</Typography>
                            <br />
                            <CardMedia
                                component="img"
                                height="194"
                                image={business.logoUrl}
                                alt="Logo"
                            />
                        </div>
                        <TextField
                            id="handle"
                            label="Shop Name"
                            value={values.businessName || business.businessName}
                            onChange={handleChange("businessName")}
                            margin="normal"
                            className="input"
                        />
                        <br />
                        <TextField
                            id="bio"
                            label="About Us"
                            value={values.aboutUs || business.aboutUs}
                            onChange={handleChange("aboutUs")}
                            margin="normal"
                            className="input"
                            multiline
                        />
                    </div>
                </CardContent>
                <EditPrizeList businessId={businessId} />
                <AddPrize
                    businessId={businessId}
                    prizes={prizes}
                    setPrizes={setPrizes}
                    setOpenSnackBar={setOpenSnackBar}
                    setAlertMsg={setAlertMsg}
                />

                <center>
                    <div className="btn-wrapper">
                        <div className="submit-btn" onClick={submitPrize}>
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

export default EditShop;
