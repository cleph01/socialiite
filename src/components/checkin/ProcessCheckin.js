import React, { useState, useContext } from "react";
import { useParams, Redirect } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";

import AddIcon from "@mui/icons-material/Add";

import { db, firebase } from "../../services/firebase/firebase-config";

import "../../lib/scss/components/checkin/process-checkin.scss";

function ProcessCheckin({
    business,
    userBizRelationship,
    setUserBizRelationship,
    setAlertMsg,
    setOpenSnackBar,
    setCheckedIn,
    checkedIn,
    dupCheckIn,
    setDupCheckIn,
}) {
    const { authUser, userState, userDispatch } = useContext(UserContext);

    const { businessId } = useParams();

    const handleCheckin = () => {
        // Check if Relationship with business exists
        db.collection("users")
            .doc(authUser.uid)
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
                            .doc(authUser.uid)
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

                                setAlertMsg({
                                    message: `Checkin Successful. New Points: ${
                                        bizRelationship.pointSum + 1
                                    }`,
                                    severity: "success",
                                });

                                setOpenSnackBar(true);

                                setCheckedIn(true);
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

                        setDupCheckIn(true);
                        setCheckedIn(true);
                    }
                } else {
                    // If relationship does NOT exist, create New Relationship
                    const relationshipData = {
                        relationshipId: business.businessId,
                        businessName: business.businessName,
                        visitCount: 1,
                        pointSum: 1,
                        redeemCount: 0,
                        redeemLog: [],
                        visitLog: [Date.now()],
                    };

                    // Create New Biz Relationship
                    db.collection("users")
                        .doc(authUser.uid)
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

                            setCheckedIn(true);

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

    console.log("Got Distance: ", userState.gotDistance);

    console.log("User State", userState);

    if (!userState.gotDistance) {
        console.log(" !Got Distance redirect triggerred");

        return <Redirect to={`/checkin/${businessId}/verify-location`} />;
    }
    return (
        <div className="process-checkin__container">
            <div className="process-checkin__wrapper">
                {dupCheckIn && checkedIn && (
                    <div className="checkin__confirmation-msg">
                        <h3>Sorry, Only One Checkin per Day. </h3>
                        <div style={{ fontSize: "36px" }}>😱</div>
                    </div>
                )}

                {checkedIn && !dupCheckIn && (
                    <div className="checkin__confirmation-msg">
                        <h3>Checkin Successful !! </h3>
                        <div style={{ fontSize: "36px" }}>🙌</div>
                        <h4>
                            Your New Points: {userBizRelationship.pointSum + 1}
                        </h4>
                        <h4>
                            Cick the {<AddIcon />} above to add to your wallet
                        </h4>
                        <h4>@ {business.businessName}</h4>
                    </div>
                )}

                {!checkedIn && (
                    <div className="checkin__btn" onClick={handleCheckin}>
                        {" "}
                        Check In{" "}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProcessCheckin;