import React, { useState, useEffect, useContext, forwardRef } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

import { db } from "../services/firebase/firebase-config";
import firebase from "firebase";

import GetLocation from "../components/checkin/GetLocation";
import Auth from "../components/auth/Auth";
import ClaimModal from "../components/modals/claim-modal/ClaimModal";
import AvailablePrizes from "../components/checkin/AvailablePrizes";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";

import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Divider from "@mui/material/Divider";

import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";

import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import ForumIcon from "@mui/icons-material/Forum";

import { getDistanceBetween } from "geolocation-distance-between";

import "../lib/scss/pages/checkin.scss";

function CheckIn() {
    const { authUser, userDispatch, userState } = useContext(UserContext);

    const { shopId } = useParams();

    const [goStatus, setGoStatus] = useState({
        fetchingDistance: false,
        gotDistance: false,
        checkedIn: false,
    });

    const [business, setBusiness] = useState();

    const [prizes, setPrizes] = useState();

    const [userBizRelationship, setUserBizRelationship] = useState(null);

    const [openClaimModal, setOpenClaimModal] = useState(false);

    const [walletPrize, setwalletPrize] = useState();

    const [geoDistance, setGeoDistance] = useState();

    const [alertMsg, setAlertMsg] = useState({
        message: "",
        severity: "success",
    });

    const [openSnackBar, setOpenSnackBar] = useState(false);

    const handleOpenClaimModal = (itemObj) => {
        if (goStatus.gotDistance && userState.userId) {
            setOpenClaimModal(true);
            setwalletPrize(itemObj);

            console.log("Wallet Prize: ", walletPrize);
        } else {
            setAlertMsg({
                message: "Please Provide Your Location and Be logged in",
                severity: "error",
            });

            setOpenSnackBar(true);
        }
    };
    const handleCloseClaimModal = () => setOpenClaimModal(false);

    const handleAddToWallet = () => {
        console.log("Add to wallet invoked: ", walletPrize);

        if (walletPrize.pointThreshold <= userBizRelationship.pointSum) {
            //Add Prize to Wallet and Update pointsSum in Biz Relationship
            db.collection("user")
                .doc(userState.userId)
                .collection("wallet")
                .add({
                    businessId: shopId,
                    businessName: business.businessName,
                    emoji: walletPrize.emoji,
                    itemDescription: walletPrize.itemDescription,
                    itemId: walletPrize.prizeId,
                    redeemed: false,
                    created: Date.now(),
                })
                .then((docRef) => {
                    console.log("Prize Added to Wallet with ID: ", docRef.id);

                    // Decrement Points Sum from BizRelationship
                    db.collection("user")
                        .doc(userState.userId)
                        .collection("bizRelationship")
                        .doc(userBizRelationship.realtionshipId)
                        .update({
                            pointSum: firebase.firestore.FieldValue.increment(
                                -walletPrize.pointThreshold
                            ),
                        })
                        .then(() => {
                            console.log("PointSum successfully updated!");
                        })
                        .catch((error) => {
                            // The document probably doesn't exist.
                            console.error("Error updating PointSume: ", error);
                        });

                    setAlertMsg({
                        message: "Item Added to Wallet.",
                        severity: "success",
                    });
                })
                .catch((error) => {
                    console.error("Error adding document: ", error);
                });
        } else {
            setAlertMsg({
                message: "Not Enouguh Points.",
                severity: "error",
            });
        }

        setOpenClaimModal(false);
        setOpenSnackBar(true);
    };

    useEffect(() => {
        console.log("Ready to Go: ", goStatus);
    }, [goStatus]);

    const handleGeoLocation = () => {
        setGoStatus({ ...goStatus, fetchingDistance: true });

        if ("geolocation" in navigator) {
            console.log("Available");

            /**
             * Do distance calcs
             */
            navigator.geolocation.getCurrentPosition(function (position) {
                console.log("Latitude is :", position.coords.latitude);
                console.log("Longitude is :", position.coords.longitude);

                let coordinateOne = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };
                let coordinateTwo = {
                    latitude: business.lat,
                    longitude: business.lon,
                };

                let distanceBetween = getDistanceBetween(
                    coordinateOne,
                    coordinateTwo
                );

                console.log("Kilometers: ", distanceBetween);

                setGeoDistance(distanceBetween);
                setGoStatus({
                    ...goStatus,
                    gotDistance: true,
                    fetchingDistance: false,
                });
            });

            // Check if Relationship with business exists
            db.collection("users")
                .doc(userState.userId)
                .collection("bizRelationships")
                .doc(shopId)
                .get()
                .then((doc) => {
                    console.log("User Biz Relationship doc: ", doc);
                    if (doc.exists) {
                        setUserBizRelationship({
                            relationshipId: shopId,
                            ...doc.data(),
                        });
                    }
                })
                .catch((error) => {
                    console.log(
                        "Error Getting Business Relationship in Geolocation: ",
                        error
                    );
                });
        } else {
            console.log("Geolocation Not Available in Your Browser");
        }
    };

    useEffect(() => {
        if (authUser) {
            db.collection("users")
                .doc(authUser.uid)
                .get()
                .then((user) => {
                    // If User exists,
                    //Set User Context with Reducer
                    console.log("User in Check User: ", user);
                    if (user.exists) {
                        console.log("User Exists");
                        userDispatch({
                            type: "USER/SET_EXISTING_USER",
                            payload: { ...user.data(), userId: user.id },
                        });
                    } else {
                        // If doesn't Exist, Create New User and set State with Reducer
                        console.log("User Doesn't Exists");
                        const newUserData = {
                            displayName: authUser.email,
                            avatarUrl: authUser.photoURL,
                            seller: false,
                            email: authUser.email,
                            phoneNumber: authUser.phoneNumber,
                            timestamp: Date.now(),
                            aboutMe: "Tell Us Something About You!! 🙌",
                            socials: {},
                            followingFriends: [],
                            followersFriends: [],
                            followingBusinesses: [],
                            userId: authUser.uid,
                        };

                        db.collection("users")
                            .doc(authUser.uid)
                            .set(newUserData)
                            .then((docRef) => {
                                userDispatch({
                                    type: "USER/CREATE_NEW_USER",
                                    payload: newUserData,
                                });

                                console.log(
                                    "Created User with Id: ",
                                    authUser.uid
                                );
                            })
                            .catch((error) => {
                                console.log("Error Creating New User: ", error);
                            });
                    }
                })
                .catch((error) => {
                    console.log("Error Checking User Exists: ", error);
                });
        }
        // Get Business Info
        db.collection("shops")
            .doc(shopId)
            .get()
            .then((doc) => {
                setBusiness(doc.data());
            })
            .catch((err) => {
                console.log("Error getting Business Info: ", err);
            });

        db.collection("shops")
            .doc(shopId)
            .collection("prizes")
            .get()
            .then((doc) => {
                console.log("docs: ", doc);
                setPrizes(
                    doc.docs.map((doc) => ({
                        prizeId: doc.id,
                        prize: doc.data(),
                    }))
                );
            })
            .catch((err) => {
                console.log("Error getting Prizes: ", err);
            });
    }, []);

    console.log("Business info: ", business);
    console.log("Prizes: ", prizes);
    console.log("Wallet Prize: ", walletPrize);
    console.log("Reducer User: ", userState);

    //every time a new post is added this code fires
    const handleCheckin = () => {
        // First Check if Proximity is confirmed and user is logged in
        const goodToGo =
            goStatus.gotDistance && !!userState.userId ? true : false;

        if (!goodToGo) {
            setGoStatus({
                ...goStatus,
                error: "Provide Location & Ensure Login",
            });

            console.log("Check IN Button Go Status Not 100");
            return;
        }

        // console.log("Check In Button Working - goodToGo: ", goodToGo);

        // Check if Relationship with business exists
        if (userBizRelationship !== null) {
            // Check if User already Checked in today
            const currTime = Date.now();

            let lastCheckin = userBizRelationship.visitLog.slice(-1)[0];

            const timeDiff = Math.abs(currTime - lastCheckin);

            const diffInMinutes = Math.ceil(timeDiff / (1000 * 60));

            console.log("Difference in Minutes: ", diffInMinutes);
            // Update Visits, etc
            // Update Counts and Log
            db.collection("users")
                .doc(userState.userId)
                .collection("bizRelationships")
                .doc(shopId)
                .update({
                    visitCount: firebase.firestore.FieldValue.increment(1),
                    pointSum: firebase.firestore.FieldValue.increment(1),
                    visitLog: firebase.firestore.FieldValue.arrayUnion(
                        Date.now()
                    ),
                })
                .then(() => {
                    console.log("BizRelationship Points Successfully Updated!");

                    setAlertMsg({
                        message: `Checkin Successful. New Points: ${
                            userBizRelationship.pointSum + 1
                        }`,
                        severity: "success",
                    });

                    setGoStatus({ ...goStatus, checkedIn: true });

                    setOpenSnackBar(true);
                })
                .catch((error) => {
                    // The document probably doesn't exist.
                    console.error(
                        "Error updating BizRelationship Points: ",
                        error
                    );
                });
        } else {
            const relationshipData = {
                relationshipId: shopId,
                businessName: business.businessName,
                visitCount: 1,
                pointSum: 1,
                redeemCount: 0,
                redeemLog: [],
                visitLog: [Date.now()],
            };

            // Create New Biz Relationship
            db.collection("users")
                .doc(userState.userId)
                .collection("bizRelationships")
                .doc(shopId)
                .set(relationshipData)
                .then((docRef) => {
                    console.log("New Relationship Created with Id: ", shopId);
                    setUserBizRelationship(relationshipData);

                    setAlertMsg({
                        message: "Checkin Successful. New Points: 1",
                        severity: "success",
                    });

                    setGoStatus({ ...goStatus, checkedIn: true });

                    setOpenSnackBar(true);
                })
                .catch((error) => {
                    console.error("Error adding document: ", error);
                });
        }
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

    console.log("User State at Checkin: ", userState);
    console.log("User Business Relationship: ", userBizRelationship);

    if (!business) {
        return <div>...Loading Checkin</div>;
    }

    return (
        <>
            <div className="container">
                <Card sx={{ maxWidth: 345 }}>
                    <CardHeader
                        avatar={
                            <Avatar
                                loading="lazy"
                                alt={business.businessName}
                                src={business.logoUrl}
                                sx={{
                                    /* bgcolor: red[500],*/
                                    width: 50,
                                    height: 50,
                                    margin: "auto",
                                    padding: "10px",
                                    border: "1px solid #f0f0f0",
                                }}
                            />
                        }
                        action={
                            <IconButton aria-label="add to favorites">
                                <LocalFireDepartmentIcon
                                    sx={{ color: "#e93f33" }}
                                />
                            </IconButton>
                        }
                        title="Chick Shack"
                        subheader="36-19 Broadway, Astoria NY"
                    />
                    <Divider />

                    <CardContent>
                        <AvailablePrizes
                            prizes={prizes}
                            handleOpenClaimModal={handleOpenClaimModal}
                            shopId={shopId}
                        />
                        <Typography variant="body1" color="text.secondary">
                            Login Each Time You Visit and Get a Chance to Win a
                            Prize!
                        </Typography>
                        <br />
                        <Typography variant="body2" color="text.secondary">
                            Share With a Friend and they AUTOMATICALLY win the
                            prize when they Login
                        </Typography>
                    </CardContent>
                </Card>
                {goStatus.gotDistance ? (
                    // Created this component to render a different view
                    // based on whether user is logged in already & thus
                    // update useEffect dependancy variable to trigger db update
                    <div className="checkin__wrapper">
                        <h3>
                            {goStatus.checkedIn
                                ? "Checkin Successful !!"
                                : "Location Confirmed"}
                        </h3>
                        <div style={{ fontSize: "36px", marginBottom: "10px" }}>
                            {goStatus.checkedIn ? "💥" : "🙌"}
                        </div>
                        {goStatus.checkedIn ? (
                            <>
                                <h4>
                                    Your New Points:{" "}
                                    {userBizRelationship.pointSum + 1}
                                </h4>
                                <h4>@ {business.businessName}</h4>
                            </>
                        ) : (
                            <div
                                className="checkin__btn"
                                onClick={handleCheckin}
                            >
                                {" "}
                                Check In{" "}
                            </div>
                        )}
                    </div>
                ) : (
                    <GetLocation
                        handleGeoLocation={handleGeoLocation}
                        goStatus={goStatus}
                    />
                )}
            </div>
            <ClaimModal
                openClaimModal={openClaimModal}
                setOpenClaimModal={setOpenClaimModal}
                handleCloseClaimModal={handleCloseClaimModal}
            />

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
        </>
    );
}

export default CheckIn;
