import React, { useState, useEffect, useContext, forwardRef } from "react";
import { useParams, Redirect, Route } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

import { db, firebase } from "../services/firebase/firebase-config";

import ClaimModal from "../components/modals/claim-modal/ClaimModal";
import AvailablePrizes from "../components/checkin/AvailablePrizes";
import VerifyLocation from "../components/checkin/VerifyLocation";
import ProcessCheckin from "../components/checkin/ProcessCheckin";
import ProcessAuth from "../components/checkin/ProcessAuth";

import Skeleton from "@mui/material/Skeleton";
import NavBar from "../components/NavBar";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";

import CardContent from "@mui/material/CardContent";

import Divider from "@mui/material/Divider";

import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";

import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import "../lib/scss/pages/checkin.scss";

function CheckIn() {
    const { userDispatch, authUser } = useContext(UserContext);
    const [checkedIn, setCheckedIn] = useState(false);
    const [dupCheckIn, setDupCheckIn] = useState(false);

    const { businessId } = useParams();

    const [goStatus, setGoStatus] = useState({
        fetchingDistance: false,
        gotDistance: false,
        checkedIn: false,
        onSite: false,
    });

    const [business, setBusiness] = useState();
    const [businessExists, setBusinessExists] = useState(false);

    const [prizes, setPrizes] = useState();

    const [userBizRelationship, setUserBizRelationship] = useState(null);

    const [openClaimModal, setOpenClaimModal] = useState(false);

    const [walletPrize, setwalletPrize] = useState();

    const [alertMsg, setAlertMsg] = useState({
        message: "",
        severity: "success",
    });

    const [openSnackBar, setOpenSnackBar] = useState(false);

    const handleOpenClaimModal = (itemObj) => {
        setOpenClaimModal(true);
        setwalletPrize(itemObj);

        console.log("Wallet Prize: ", walletPrize);
    };

    const handleCloseClaimModal = () => setOpenClaimModal(false);

    const handleAddToWallet = () => {
        console.log("Add to wallet invoked: ", walletPrize);

        if (walletPrize.pointCost <= userBizRelationship.pointSum) {
            //Add Prize to Wallet and Update pointsSum in Biz Relationship
            db.collection("wallet")
                .add({
                    userId: authUser.uid,
                    businessId: businessId,
                    businessName: business.businessName,
                    emoji: walletPrize.emoji,
                    itemDescription: walletPrize.description,
                    itemId: walletPrize.prizeId,
                    redeemed: false,
                    publicWallet: true,
                    tags: walletPrize.tags,
                    tradeOffers: [],
                    offeredInTrade: false,
                    pointCost: walletPrize.pointCost,
                    created: Date.now(),
                })
                .then((docRef) => {
                    console.log("Prize Added to Wallet with ID: ", docRef.id);

                    // Decrement Points Sum from BizRelationship
                    db.collection("users")
                        .doc(authUser.uid)
                        .collection("bizRelationships")
                        .doc(userBizRelationship.businessId)
                        .update({
                            pointSum: firebase.firestore.FieldValue.increment(
                                -walletPrize.pointCost
                            ),
                        })
                        .then(() => {
                            console.log("PointSum successfully updated!");

                            setUserBizRelationship((prevState) => {
                                return {
                                    ...prevState,
                                    pointSum:
                                        prevState.pointSum -
                                        walletPrize.pointCost,
                                };
                            });
                        })
                        .catch((error) => {
                            // The document probably doesn't exist.
                            console.error("Error updating PointSume: ", error);
                        });

                    setAlertMsg({
                        message: "Item Added to Wallet.",
                        severity: "success",
                    });

                    setOpenSnackBar(true);
                })
                .catch((error) => {
                    console.error("Error adding to wallet: ", error);

                    setAlertMsg({
                        message: "Error Adding to Wallet.",
                        severity: "error",
                    });

                    setOpenSnackBar(true);
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
        // Get Business Info
        db.collection("shops")
            .doc(businessId)
            .get()
            .then((doc) => {
                setBusinessExists(doc.exists);
                setBusiness({ businessId: businessId, ...doc.data() });
            })
            .catch((err) => {
                console.log("Error getting Business Info: ", err);
            });

        db.collection("shops")
            .doc(businessId)
            .collection("prizes")
            .get()
            .then((doc) => {
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

    const Alert = forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const handleCloseSnackBar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpenSnackBar(false);
    };

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
        <>
            <div
                className="checkin__container"
                style={{ backgroundImage: 'url("/logo192.png")' }}
            >
                <NavBar />
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
                            businessId={businessId}
                            checkedIn={checkedIn}
                            dupCheckIn={dupCheckIn}
                        />
                        <Typography variant="body1" color="text.secondary">
                            Login Each Time You Visit and Get a Chance to Win a
                            Prize!
                        </Typography>
                        <br />
                        <Typography variant="body2" color="text.secondary">
                            Post a Shoutout, Share a Prizee With a Friend !! You
                            get paid and they AUTOMATICALLY win the prize when
                            they Login
                        </Typography>
                    </CardContent>
                </Card>

                <ProcessAuth redirectPath={`/checkin/${businessId}/process`} />

                <Route path={`/checkin/${businessId}/verify-location`}>
                    <VerifyLocation
                        setGoStatus={setGoStatus}
                        goStatus={goStatus}
                        business={business}
                        setAlertMsg={setAlertMsg}
                        setOpenSnackBar={setOpenSnackBar}
                    />
                </Route>

                <Route path="/checkin/:businessId/process">
                    <ProcessCheckin
                        business={business}
                        userBizRelationship={userBizRelationship}
                        setUserBizRelationship={setUserBizRelationship}
                        setAlertMsg={setAlertMsg}
                        setOpenSnackBar={setOpenSnackBar}
                        checkedIn={checkedIn}
                        setCheckedIn={setCheckedIn}
                        dupCheckIn={dupCheckIn}
                        setDupCheckIn={setDupCheckIn}
                    />
                </Route>
            </div>
            <ClaimModal
                openClaimModal={openClaimModal}
                setOpenClaimModal={setOpenClaimModal}
                handleCloseClaimModal={handleCloseClaimModal}
                handleAddToWallet={handleAddToWallet}
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

export default React.memo(CheckIn);
