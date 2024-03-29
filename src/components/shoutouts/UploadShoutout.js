import React, { useState, useContext, useEffect, forwardRef } from "react";

// import { uuid } from "uuid";
import { Redirect } from "react-router-dom";
import { PickerInline } from "filestack-react";
import UploadIcon from "@mui/icons-material/Upload";

import Skeleton from "@mui/material/Skeleton";

import Signup from "../../components/youtube-auth/Signup";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import "../../lib/scss/components/shoutouts/upload-shoutout.scss";

import { UserContext } from "../../contexts/UserContext";

import { db, storage, firebase } from "../../services/firebase/firebase-config";
import { width } from "@mui/system";

// const youtube = google.youtube("v3");

function UploadShoutout() {
    const { authUser, userState } = useContext(UserContext);

    const [values, setValues] = useState({
        image: "",
        caption: "",
        tags: "",
        redirect: false,
        error: "",
        postId: "",
    });

    const [progress, setProgress] = useState(0);
    const [bizRelationships, setBizRelationships] = useState();
    const [businessInfo, setBusinessInfo] = useState();
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [alertMsg, setAlertMsg] = useState({
        message: "",
        severity: "",
    });

    const Alert = forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const handleCloseSnackBar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpenSnackBar(false);
    };

    const handleChange = (name) => (event) => {
        const value =
            name === "image" ? event.target.files[0] : event.target.value;
        setValues({ ...values, [name]: value });
    };

    const handleSelectBusiness = (event, child) => {
        setBusinessInfo({
            businessId: child.props.businessid,
            businessName: event.target.value,
        });
    };

    const handleUpload = () => {
        const uniqueId = Date.now();

        if (
            values.image &&
            values.image &&
            values.caption &&
            values.tags &&
            businessInfo
        ) {
            let ext = values.image.name.split(".").pop();

            const uploadTask = storage
                .ref(`shoutouts/${authUser.uid}/${uniqueId}.${ext}`)
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
                        .ref(`shoutouts/${authUser.uid}`)
                        .child(`${uniqueId}.${ext}`)
                        .getDownloadURL()
                        .then((url) => {
                            // post image inside db

                            let postData = {
                                userId: authUser.uid,
                                imageUrl: url,
                                caption: values.caption,
                                tags: values.tags,
                                businessId: businessInfo.businessId,
                                businessName: businessInfo.businessName,
                                likes: [],
                                comments: [],
                                timestamp:
                                    firebase.firestore.FieldValue.serverTimestamp(),
                            };

                            db.collection("shoutouts")
                                .add(postData)
                                .then((docRef) => {
                                    console.log("DocRef ID: ", docRef.id);
                                    setAlertMsg({
                                        message:
                                            "Successfully Published Shoutout",
                                        severity: "success",
                                    });

                                    setValues({
                                        image: "",
                                        caption: "",
                                        tags: "",
                                        redirect: true,
                                        error: "",
                                        postId: docRef.id,
                                    });

                                    setOpenSnackBar(true);
                                })
                                .catch((error) => {
                                    setAlertMsg({
                                        message:
                                            "Error Publishin Shoutout. Try Again",
                                        severity: "error",
                                    });

                                    setOpenSnackBar(true);
                                });

                            setProgress(0);
                        });
                }
            );
        } else {
            setAlertMsg({
                message: "Fields Cannot Be Blank",
                severity: "error",
            });

            setOpenSnackBar(true);
        }
    };

    useEffect(() => {
        db.collection("users")
            .doc(authUser.uid)
            .collection("bizRelationships")
            .get()
            .then((querySnapshot) => {
                console.log("Snapshot in functions: ", querySnapshot);
                if (querySnapshot.docs.length > 0) {
                    setBizRelationships(
                        querySnapshot.docs.map((doc) => ({
                            businessId: doc.id,
                            businessInfo: doc.data(),
                        }))
                    );
                } else {
                    setBizRelationships([]);
                }
            })
            .catch((error) => {
                console.log("Error getting All Biz Relationships: ", error);
            });
    }, []);

    console.log("User State at Shoutout Upload: ", userState);
    if (values.redirect) {
        return (
            <Redirect
                to={`/shoutout/${values.postId}/${businessInfo.businessId}`}
            />
        );
    }

    if (!bizRelationships) {
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
        <div className="upload-shoutout__container">
            <CardContent>
                <center>
                    <h1>New Shoutout</h1>
                    <div className="file-input">
                        <input
                            type="file"
                            className="file"
                            id="file"
                            onChange={handleChange("image")}
                        />
                        <label htmlFor="file">
                            Upload Image <UploadIcon />
                            <p className="file-name"></p>
                        </label>
                    </div>
                </center>
                <progress
                    className="imageupload__progress"
                    value={progress}
                    max="100"
                />
                <br />
                <div className="">
                    {values.image && (
                        <img
                            style={{ width: "300px", height: "auto" }}
                            alt="preview"
                            src={URL.createObjectURL(values.image)}
                        />
                    )}
                </div>
                <div className="biz-relationship__wrapper">
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                            Select Brand for Your Shoutout
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={
                                businessInfo?.businessName
                                    ? businessInfo.businessName
                                    : ""
                            }
                            label="business"
                            onChange={handleSelectBusiness}
                            required
                        >
                            {bizRelationships?.map((business) => (
                                <MenuItem
                                    key={business.businessId}
                                    value={business.businessInfo.businessName}
                                    businessid={business.businessId}
                                >
                                    {business.businessInfo.businessName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <br />
                <TextField
                    id="multiline-flexible"
                    label="Caption"
                    multiline
                    rows="2"
                    value={values.caption}
                    onChange={handleChange("caption")}
                    className=""
                    margin="normal"
                />
                <br />
                <TextField
                    id="tags"
                    label="tags"
                    className=""
                    value={values.tags}
                    onChange={handleChange("tags")}
                    margin="normal"
                />
                <br />
                <br />{" "}
                {values.error && (
                    <div>
                        <div color="error" className="">
                            error
                        </div>
                        {values.error}
                    </div>
                )}
            </CardContent>
            <CardActions>
                <button onClick={handleUpload} className="upload-shoutout-btn">
                    Submit
                </button>
            </CardActions>

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

export default UploadShoutout;
