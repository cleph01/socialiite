import React, { useState, useEffect, forwardRef } from "react";
import { useHistory, useParams } from "react-router-dom";

import { storage, db } from "../../services/firebase/firebase-config";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import Divider from "@mui/material/Divider";

import Skeleton from "@mui/material/Skeleton";

import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import EditShopLogoUpload from "../my-shops/EditShopLogoUpload";
import EditPrizeList from "./EditPrizeList";
import AddPrize from "./AddPrize";

import "../../lib/scss/components/my-shops/edit-shop.scss";

function EditShop() {
    const history = useHistory();

    const { businessId } = useParams();

    const [business, setBusiness] = useState();

    const [prizes, setPrizes] = useState([]);

    const [showAddPrize, setShowAddPrize] = useState(false);

    const [progress, setProgress] = useState();

    console.log("businessId: ", businessId);

    const [values, setValues] = useState({
        businessName: "",
        aboutUs: "",
        logoUrl: "",
        image: null,
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

    const submitUpdate = () => {
        if (values.image) {
            const ext = values.image.name.split(".").pop();

            const uploadTask = storage
                .ref(`logos/${businessId}/logo.${ext}`)
                .put(values.image);

            uploadTask.on(
                "state-changed",
                (snapshot) => {
                    // progress bar function
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );

                    setProgress(progress);
                },
                (error) => {
                    // Error function
                    console.log(error);
                    alert(error.message);
                },
                () => {
                    // complete function...
                    storage
                        .ref(`logos/${businessId}`)
                        .child(`logo.${ext}`)
                        .getDownloadURL()
                        .then((url) => {
                            // Update bizObject
                            const bizObj = {
                                businessName:
                                    values.businessName ||
                                    business.businessName,
                                aboutUs: values.aboutUs || business.aboutUs,
                                logoUrl: url,
                            };

                            db.collection("shops")
                                .doc(businessId)
                                .update({
                                    updateTimestamp: Date.now(),
                                    ...bizObj,
                                })
                                .then(() => {
                                    if (prizes.length > 0) {
                                        prizes.forEach((prize) => {
                                            db.collection("prizes")
                                                .add({
                                                    businessId: businessId,
                                                    timestamp: Date.now(),
                                                    ...prize,
                                                })
                                                .then((prizeRef) => {
                                                    console.log(
                                                        "Prize Added: ",
                                                        prizeRef.id
                                                    );
                                                })
                                                .catch((error) => {
                                                    console.log(
                                                        "Error Saving Prizes: ",
                                                        error
                                                    );
                                                });
                                        });
                                    }

                                    setAlertMsg({
                                        message: "Edits Saved Successfully!",
                                        severity: "success",
                                    });
                                    setOpenSnackBar(true);
                                })
                                .catch((error) => {
                                    console.log(
                                        "Error Saving Edited Business: ",
                                        error
                                    );

                                    setAlertMsg({
                                        message: "Edits Failed to Save",
                                        severity: "error",
                                    });
                                    setOpenSnackBar(true);
                                });

                            setProgress(0);

                            setValues((prevState) => ({
                                ...prevState,
                                image: null,
                            }));
                        });
                }
            );
        } else if (values.businessName || values.aboutUs || prizes.length > 0) {
            // Update business Object only
            const bizObj = {
                businessName: values.businessName || business.businessName,
                aboutUs: values.aboutUs || business.aboutUs,
                logoUrl: business.logoUrl || "",
                tags: values.tags.split(" ") || business.tags,
            };

            db.collection("shops")
                .doc(businessId)
                .update({
                    updateTimestamp: Date.now(),
                    ...bizObj,
                })
                .then(() => {
                    if (prizes.length > 0) {
                        prizes.forEach((prize) => {
                            db.collection("prizes")
                                .add({
                                    businessId: businessId,
                                    timestamp: Date.now(),
                                    ...prize,
                                })
                                .then((prizeRef) => {
                                    console.log("Prize Added: ", prizeRef.id);
                                })
                                .catch((error) => {
                                    console.log("Error Saving Prizes: ", error);
                                });
                        });
                    }
                    setAlertMsg({
                        message: "Edits Saved Successfully!",
                        severity: "success",
                    });
                    setOpenSnackBar(true);
                })
                .catch((error) => {
                    console.log("Error Saving Edited Business: ", error);

                    setAlertMsg({
                        message: "Edits failed!",
                        severity: "error",
                    });
                    setOpenSnackBar(true);
                });
        } else {
            alert("Nothing to Upload");
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
    }, [businessId]);

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
                        <EditShopLogoUpload
                            setValues={setValues}
                            values={values}
                            progress={progress}
                        />
                        <Divider sx={{ width: "100%" }} />
                        <div className="logo-header">
                            <Typography variant="h5">
                                {business.logoUrl
                                    ? "Current Logo: "
                                    : "Preview: "}
                            </Typography>
                            <br />
                            {(business.logoUrl || values.image) && (
                                <CardMedia
                                    component="img"
                                    height="194"
                                    image={
                                        business.logoUrl ||
                                        URL.createObjectURL(values.image)
                                    }
                                    alt="Logo"
                                />
                            )}
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
                        <br />
                        <TextField
                            id="bio"
                            label="Tags"
                            value={values.tags || business.tags.join(" ")}
                            onChange={handleChange("tags")}
                            margin="normal"
                            className="input"
                            multiline
                        />
                    </div>
                </CardContent>
                <EditPrizeList businessId={businessId} />
                {!showAddPrize ? (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginBottom: "25px",
                        }}
                        onClick={() => setShowAddPrize(true)}
                    >
                        <AddCircleOutlineIcon />
                        {"  "}Add Prize
                    </div>
                ) : (
                    <AddPrize
                        businessId={businessId}
                        prizes={prizes}
                        setPrizes={setPrizes}
                        setOpenSnackBar={setOpenSnackBar}
                        setAlertMsg={setAlertMsg}
                        setShowAddPrize={setShowAddPrize}
                    />
                )}

                <center>
                    <div className="btn-wrapper">
                        <div className="submit-btn" onClick={submitUpdate}>
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
