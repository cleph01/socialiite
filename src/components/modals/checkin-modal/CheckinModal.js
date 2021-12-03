import { useState } from "react";

import { useParams } from "react-router-dom";

import { db, firebase } from "../../../services/firebase/firebase-config";

import Box from "@mui/material/Box";

import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

import logo from "../../../assets/images/logos/flame-only-logo.png";

const style = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 355,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

const redeemStyle = {
    textAlign: "center",
    width: "fit-content",
    fontSize: "small",
    marginLeft: "10px",
    // background-color: #bcc0bc,
    color: "#213b77",
    border: "1px solid #213b77",
    borderRadius: "5px",
    padding: "10px",
    cursor: "pointer",
};

const cancelStyle = {
    textAlign: "center",
    width: "fit-content",
    fontSize: "small",
    marginLeft: "10px",
    // background-color: #bcc0bc,
    color: "#bb3133",
    border: "1px solid #bb3133",
    borderRadius: "5px",
    padding: "10px",
    cursor: "pointer",
};

function CheckinModal({
    setAlertMsg,
    setOpenSnackBar,
    openCheckinModal,
    handleCloseCheckinModal,
    handleCheckedInToggle,
    checkinUser,
    setUserBizRelationship,
    business,
}) {
    const { businessId } = useParams();

    const handleCheckin = () => {
        // Check if Relationship with business exists
        db.collection("users")
            .doc(checkinUser.userId)
            .collection("bizRelationships")
            .doc(businessId)
            .get()
            .then((doc) => {
                console.log("User Biz Relationship doc: ", doc);
                if (doc.exists) {
                    console.log("Relationship exists");

                    // If Relationship Exists, Update Visit data
                    setUserBizRelationship({
                        businessId: businessId,
                        ...doc.data(),
                    });

                    const bizRelationship = doc.data();

                    const currTime = Date.now();

                    let lastCheckin = bizRelationship.visitLog.slice(-1)[0];

                    const timeDiff = Math.abs(currTime - lastCheckin);

                    const diffInDays = timeDiff / (1000 * 60 * 60);

                    console.log("Difference in Days: ", diffInDays);
                    // Update Visits, etc
                    // Update Counts and Log
                    if (diffInDays >= 1) {
                        db.collection("users")
                            .doc(checkinUser.userId)
                            .collection("bizRelationships")
                            .doc(businessId)
                            .update({
                                visitCount:
                                    firebase.firestore.FieldValue.increment(1),
                                pointSum:
                                    firebase.firestore.FieldValue.increment(1),
                                visitLog:
                                    firebase.firestore.FieldValue.arrayUnion(
                                        Date.now()
                                    ),
                            })
                            .then(() => {
                                console.log(
                                    "BizRelationship Points Successfully Updated!"
                                );

                                setUserBizRelationship({
                                    businessId: businessId,
                                    ...doc.data(),
                                });

                                setUserBizRelationship((prevState) => ({
                                    ...prevState,
                                    pointSum: prevState.pointSum + 1,
                                }));

                                setAlertMsg({
                                    message: `Checkin Successful. New Points: ${
                                        bizRelationship.pointSum + 1
                                    }`,
                                    severity: "success",
                                });

                                setOpenSnackBar(true);

                                handleCheckedInToggle(true);
                            })
                            .catch((error) => {
                                // The document probably doesn't exist.
                                console.error(
                                    "Error updating BizRelationship Points: ",
                                    error
                                );
                            });
                    } else {
                        setAlertMsg({
                            message: "Sorry, Only One Checkin Per Day",
                            severity: "error",
                        });

                        setOpenSnackBar(true);

                        handleCheckedInToggle(false);
                    }
                } else {
                    // If relationship does NOT exist, create New Relationship
                    const relationshipData = {
                        businessId: business.businessId,
                        businessName: business.businessName,
                        visitCount: 1,
                        pointSum: 1,
                        redeemCount: 0,
                        redeemLog: [],
                        visitLog: [Date.now()],
                    };

                    // Create New Biz Relationship
                    db.collection("users")
                        .doc(checkinUser.userId)
                        .collection("bizRelationships")
                        .doc(businessId)
                        .set(relationshipData)
                        .then((docRef) => {
                            console.log(
                                "New Relationship Created with Id: ",
                                businessId
                            );
                            setUserBizRelationship(relationshipData);

                            setAlertMsg({
                                message: "Checkin Successful. New Points: 1",
                                severity: "success",
                            });

                            handleCheckedInToggle(true);

                            setOpenSnackBar(true);
                        })
                        .catch((error) => {
                            console.error("Error adding document: ", error);

                            setAlertMsg({
                                message: "Error Processing Checkin",
                                severity: "error",
                            });

                            setOpenSnackBar(true);
                        });
                }
            })
            .catch((error) => {
                console.log(
                    "Error Getting Business Relationship in Process Checkin: ",
                    error
                );
            });
    };

    return (
        <Modal
            open={openCheckinModal}
            onClose={handleCloseCheckinModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <div>
                    <span style={{ fontSize: "56px" }}>👊</span>
                    <img
                        alt="socialiite"
                        src={logo}
                        style={{ width: "100px", height: "auto" }}
                    />
                    <span style={{ fontSize: "56px" }}>👍</span>
                </div>
                <h3>Confirm Checking In for:</h3>

                <h4>{checkinUser.displayName}</h4>
                <h5>{checkinUser.email}</h5>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center",
                        marginTop: "15px",
                    }}
                >
                    <div style={redeemStyle} onClick={handleCheckin}>
                        Check In
                    </div>
                    <div style={cancelStyle} onClick={handleCloseCheckinModal}>
                        Cancel
                    </div>
                </div>
            </Box>
        </Modal>
    );
}

export default CheckinModal;
