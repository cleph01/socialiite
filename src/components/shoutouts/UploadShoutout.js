import React, { useState, useContext, useEffect, forwardRef } from "react";
import axios from "axios";
import { uuid } from "uuid/v4";
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

function UploadShoutout() {
    const { authUser } = useContext(UserContext);

    const [values, setValues] = useState({
        video: "",
        caption: "",
        tags: "",
        redirect: false,
        error: "",
        postId: "",
    });

    const [url, setUrl] = useState(null);
    const [storagePath, setStoragePath] = useState();
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
            name === "video" ? event.target.files[0] : event.target.value;
        setValues({ ...values, [name]: value });
    };

    const handleSelectBusiness = (event, child) => {
        setBusinessInfo({
            businessId: child.props.businessid,
            businessName: event.target.value,
        });
    };

    // Submit
    const handleSubmit = () => {
        const tempInput = {
            storagePath:
                "https://firebasestorage.googleapis.com/v0/b/socialiite.appspot.com/o/shoutouts%2FEpuj5NNcOjTYu4lKcVBtEnLXttC3%2F1638663387271.mp4?alt=media&token=e6ca2793-2cfb-4444-9c33-00215c5df972",
            title: "El Titulo",
            description: "El Description",
        };
        // send YouTube Stuff
        const API_END_POINT = "https://accounts.google.com/o/oauth2/v2/auth";

        const postData = {
            scope: "https://www.googleapis.com/auth/youtube.upload",
            state: JSON.stringify({ tempInput }),
            redirect_uri: "http://localhost:3000/hero/upload-success",
            response_type: "token",
            client_id:
                "467034634375-54bffnbjerdb3n6phddhjkfaatgaqunu.apps.googleusercontent.com",
        };

        // https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/youtube.upload&redirect_uri=http://localhost:3000/hero/upload-success&response_type=token&client_id=467034634375-54bffnbjerdb3n6phddhjkfaatgaqunu.apps.googleusercontent.com

        // let URL = `https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/youtube.upload&redirect_uri=http://localhost:3000/hero/upload-success&response_type=token&client_id=${REACT_APP_YOUTUBE_ID}`;

        fetch(
            encodeURI(
                "https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/youtube.upload&redirect_uri=http://localhost:3000/hero/upload-success&response_type=token&client_id=467034634375-54bffnbjerdb3n6phddhjkfaatgaqunu.apps.googleusercontent.com"
            )
            // {
            //     mode: "no-cors",
            //     'Content-Type': 'application/x-www-form-urlencoded'
            // }
        )
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.log("Error hitting getting oAuth permission: ", error);
            });
    };

    const handleUpload = () => {
        const uniqueId = uuid();

        if (values.video) {
            setStoragePath(`shoutouts/${authUser.uid}/${uniqueId}.mp4`);

            const uploadTask = storage
                .ref(`shoutouts/${authUser.uid}/${uniqueId}.mp4`)
                .put(values.video, { contentType: "video.mp4" });

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
                    console.log("Error Uploading Video: ", error);
                    alert(error.message);
                },
                () => {
                    // complete function...
                    storage
                        .ref(`shoutouts/${authUser.uid}/`)
                        .child(`${uniqueId}.mp4`)
                        .getDownloadURL()
                        .then((url) => {
                            // post video inside db
                            let postData = {
                                userId: authUser.uid,
                                postUrl: url,
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
                                            "Stored! Now Sending to YouTube",
                                        severity: "success",
                                    });

                                    setValues({
                                        ...values,
                                        postId: docRef.id,
                                    });

                                    setOpenSnackBar(true);

                                    // send YouTube Stuff
                                    axios
                                        .post(
                                            "https://us-central1-socialiite.cloudfunctions.net/uploadVideo",
                                            {
                                                title: "El Titulo",
                                                description: "El Description",
                                            }
                                        )
                                        .then((response) => {
                                            console.log(response.data);
                                        })
                                        .catch((error) => {
                                            console.log(
                                                "Error hitting Cloud upload function"
                                            );
                                        });
                                })
                                .catch((error) => {
                                    setAlertMsg({
                                        message:
                                            "Error Saving Shoutout details to db.",
                                        severity: "error",
                                    });

                                    setOpenSnackBar(true);
                                });

                            setProgress(0);

                            setValues({
                                ...values,
                                video: "",
                                caption: "",
                                tags: "",
                                redirect: true,
                                error: "",
                            });
                        })
                        .catch((error) => {
                            console.log("Error getting download Url: ", error);
                        });
                }
            );
        } else {
            alert("Video Upload Failed");
        }
    };

    const clientOptions = {
        accept: "video/*",
        fromSources: ["local_file_system", "instagram", "facebook"],
        maxSize: 1000000000,
    };

    const onSuccess = (result) => {
        console.log("FileStack Url: ", result.filesUploaded[0].url);

        let postData = {
            userId: authUser.uid,
            postUrl: result.filesUploaded[0].url,
            caption: values.caption,
            tags: values.tags,
            businessId: businessInfo.businessId,
            businessName: businessInfo.businessName,
            likes: [],
            comments: [],
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        };

        db.collection("shoutouts")
            .add(postData)
            .then((docRef) => {
                console.log("DocRef ID: ", docRef.id);
                setAlertMsg({
                    message: "Successfully Published Shoutout",
                    severity: "success",
                });

                setValues({
                    ...values,
                    postId: docRef.id,
                });

                setOpenSnackBar(true);
            })
            .catch((error) => {
                setAlertMsg({
                    message: "Error Publishin Shoutout. Try Again",
                    severity: "error",
                });

                setOpenSnackBar(true);
            });

        setProgress(0);

        setValues({
            ...values,
            video: "",
            caption: "",
            tags: "",
            redirect: true,
            error: "",
        });
    };
    const onError = (error) => {
        console.error("error FileStack: ", error);
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

    if (values.redirect) {
        return <Redirect to={"/hero/shoutout/" + values.postId} />;
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
            <Signup />
            {/* <CardContent>
                <center>
                    <h1>New Video</h1>
                    <PickerInline
                        apikey={process.env.REACT_APP_FILESTACK_KEY}
                        buttonText="Upload Video"
                        buttonClass="ui medium button gray"
                        options={clientOptions}
                        onSuccess={onSuccess}
                        onUploadDone={(res) =>
                            console.log("on upload done: ", res)
                        }
                        onError={onError}
                    />
                    <input
                        accept="video/*"
                        onChange={handleChange("video")}
                        className="file-input"
                        id="icon-button-file"
                        type="file"
                    />
                    <label hor="icon-button-file">
                        <button
                            color="secondary"
                            variant="contained"
                            component="span"
                        >
                            Upload
                            <UploadIcon />
                        </button>
                    </label>{" "}
                </center>
                <span className="">
                    {values.video ? values.video.name : ""}
                </span>
                <progress
                    className="imageupload__progress"
                    value={progress}
                    max="100"
                />
                <br />
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
                <button onClick={handleSubmit} className="upload-shoutout-btn">
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
                        severity="success"
                        sx={{ width: "100%" }}
                    >
                        {alertMsg.message}
                    </Alert>
                </Snackbar>
            </Stack> */}
        </div>
    );
}

export default UploadShoutout;
