import React, { useState, useContext, useEffect, forwardRef } from "react";

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
// import { google } from "googleapis" ;
// const youtube = google.youtube("v3");

function UploadShoutout() {
    const { authUser, userState } = useContext(UserContext);

    const [GoogleAuthObj, setGoogleAuthObj] = useState();

    const [accessToken, setAccessToken] = useState(null);

    const initClient = () => {
        window.gapi.client
            .init({
                apiKey: process.env.REACT_APP_API_KEY,
                clientId: process.env.REACT_APP_CLIENT_ID,
                scope: "https://www.googleapis.com/auth/youtube.upload",
                discoveryDocs: [
                    "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest",
                ],
            })
            .then(() => {
                setGoogleAuthObj(window.gapi.auth2.getAuthInstance());
                console.log(
                    "Success Got Client Obj: ",
                    window.gapi.auth2.getAuthInstance()
                );

                setAccessToken(
                    window.gapi.auth2
                        .getAuthInstance()
                        .currentUser.get()
                        .getAuthResponse(true).access_token
                );
            })
            .catch((error) => {
                console.log("Error Inializing Gapi: ", error);
            });
    };

    console.log("Gapi Obj: ", GoogleAuthObj);
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
        console.log("Submit");
        const request = window.gapi.client.youtube.videos.insert({
            part: "snippet,contentDetails,status",
            resource: {
                // Video title and description
                snippet: {
                    title: "El Titulo",
                    description: "El Description",
                    categoryId: "22",
                },
                status: {
                    privacyStatus: "public",
                },
            },
            media: {
                mimeType: "video/mp4",
                body: values.video.stream(), // readable stream
            },
        });

        request.execute((res) => console.log("response: ", res));
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

    const onSuccess = (result) => {
        console.log("Youtube Url: ", result);

        // let postData = {
        //     userId: authUser.uid,
        //     postUrl: result.filesUploaded[0].url,
        //     caption: values.caption,
        //     tags: values.tags,
        //     businessId: businessInfo.businessId,
        //     businessName: businessInfo.businessName,
        //     likes: [],
        //     comments: [],
        //     timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        // };

        // db.collection("shoutouts")
        //     .add(postData)
        //     .then((docRef) => {
        //         console.log("DocRef ID: ", docRef.id);
        //         setAlertMsg({
        //             message: "Successfully Published Shoutout",
        //             severity: "success",
        //         });

        //         setValues({
        //             ...values,
        //             postId: docRef.id,
        //         });

        //         setOpenSnackBar(true);
        //     })
        //     .catch((error) => {
        //         setAlertMsg({
        //             message: "Error Publishin Shoutout. Try Again",
        //             severity: "error",
        //         });

        //         setOpenSnackBar(true);
        //     });

        // setProgress(0);

        // setValues({
        //     ...values,
        //     video: "",
        //     caption: "",
        //     tags: "",
        //     redirect: true,
        //     error: "",
        // });
    };
    const onError = (error) => {
        console.error("error YouTube: ", error);
    };

    useEffect(() => {
        window.gapi.load("client:auth2", initClient);
    }, []);

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
            {GoogleAuthObj?.currentUser
                .get()
                .hasGrantedScopes(
                    "https://www.googleapis.com/auth/youtube.upload"
                ) ? (
                <>
                    <div onClick={() => GoogleAuthObj.signOut()}>
                        isAuthorized - SignOut
                    </div>
                    <div>{`auth toke: ${
                        GoogleAuthObj?.currentUser.get().getAuthResponse(true)
                            .access_token
                    }`}</div>
                </>
            ) : (
                <div onClick={() => GoogleAuthObj.signIn()}>
                    Google Sign IN Button
                </div>
            )}
            <Signup setAccessToken={setAccessToken} />
            <CardContent>
                <center>
                    <h1>New Video</h1>
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
            </Stack>
        </div>
    );
}

export default UploadShoutout;
