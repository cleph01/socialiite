import { useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";
import Box from "@mui/material/Box";

import Modal from "@mui/material/Modal";

import { db, firebase } from "../../../services/firebase/firebase-config";

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

function ClaimModal({
    openClaimModal,
    handleCloseClaimModal,
    walletPrize,
    userBizRelationship,
    setUserBizRelationship,
    business,
    setAlertMsg,
    setOpenClaimModal,
    setOpenSnackBar,
}) {
    const { authUser } = useContext(UserContext);

    const handleAddToWallet = () => {
        // Reject if No Relationship exists and they're trying to claim a reward
        if (!userBizRelationship && walletPrize.prize.pointCost > 0) {
            setAlertMsg({
                message: "Welcome! Claim a Freebie First! 🚀 ",
                severity: "error",
            });
        } else if (!userBizRelationship && walletPrize.prize.incentive) {
            // Create new relationship if No Relationship exists and they're trying to claim incentive

            const relationshipData = {
                relationshipId: business.businessId,
                businessName: business.businessName,
                visitCount: 0,
                pointSum: 0,
                redeemCount: 0,
                redeemLog: [],
                visitLog: [],
            };

            const walletItem = {
                businessId: business.businessId,
                businessName: business.businessName,
                emoji: walletPrize.prize.emoji,
                itemDescription: walletPrize.prize.description,
                prizeId: walletPrize.prizeId,
                pointCost: walletPrize.prize.pointCost,
                publicWallet: true,
                redeemed: false,
                tags: walletPrize.prize.tags,
                timestamp: Date.now(),
                userId: authUser.uid,
                tradeOffers: [],
                offeredInTrade: false,
            };

            db.collection("users")
                .doc(authUser.uid)
                .collection("bizRelationships")
                .doc(business.businessId)
                .set(relationshipData)
                .then((docRef) => {
                    console.log(
                        "New Relationship Created with Id: ",
                        business.businessId
                    );
                    setUserBizRelationship(relationshipData);

                    db.collection("wallet")
                        .add(walletItem)
                        .then((newWalletItemId) => {
                            setAlertMsg({
                                message:
                                    "Relationship Created and Item Added to Your Wallet 💰",
                                severity: "success",
                            });

                            setOpenSnackBar(true);
                        })
                        .catch((error) => {
                            console.log("Error Adding to Wallet: ", error);
                        });
                })
                .catch((error) => {
                    console.error("Error adding document: ", error);
                });
        } else if (
            walletPrize.prize.pointCost <= userBizRelationship.pointSum
        ) {
            const walletItem = {
                businessId: business.businessId,
                businessName: business.businessName,
                emoji: walletPrize.prize.emoji,
                itemDescription: walletPrize.prize.description,
                prizeId: walletPrize.prizeId,
                pointCost: walletPrize.prize.pointCost,
                publicWallet: true,
                redeemed: false,
                tags: walletPrize.prize.tags,
                timestamp: Date.now(),
                userId: authUser.uid,
                tradeOffers: [],
                offeredInTrade: false,
            };

            // Add Prize to Wallet and Update pointsSum in Biz Relationship

            db.collection("wallet")
                .add(walletItem)
                .then((newWalletItemId) => {
                    // Decrement Prize Point Threshold from BizRelationship Tally
                    db.collection("users")
                        .doc(authUser.uid)
                        .collection("bizRelationships")
                        .doc(userBizRelationship.businessId)
                        .update({
                            pointSum: firebase.firestore.FieldValue.increment(
                                -walletPrize.prize.pointCost
                            ),
                        })
                        .then(() => {
                            console.log(
                                "Pre PointSum Update: ",
                                userBizRelationship
                            );
                            setUserBizRelationship((prevState) => ({
                                ...prevState,
                                pointSum:
                                    prevState.pointSum -
                                    walletPrize.prize.pointCost,
                            }));
                        })
                        .catch((error) => {
                            // The document probably doesn't exist.
                            console.error("Error updating PointSume: ", error);
                        });

                    const updatedPoints =
                        userBizRelationship.pointSum -
                        walletPrize.prize.pointCost;
                    console.log("Post PointSum Update: ", userBizRelationship);
                    setAlertMsg({
                        message: `Item Added to Wallet. New Points: ${updatedPoints}`,
                        severity: "success",
                    });

                    setOpenSnackBar(true);
                })
                .catch((error) => {
                    console.log("Error Adding to Wallet: ", error);
                });
        } else {
            setAlertMsg({
                message: "Not Enouguh Points.",
                severity: "error",
            });

            setOpenSnackBar(true);
        }

        setOpenClaimModal(false);
    };

    return (
        <Modal
            open={openClaimModal}
            onClose={handleCloseClaimModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <h3>Sure About Claiming Prize?</h3>

                <h4>Cannot Be Reversed</h4>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center",
                        marginTop: "15px",
                    }}
                >
                    <div style={redeemStyle} onClick={handleAddToWallet}>
                        Claim Prize
                    </div>
                    <div style={cancelStyle} onClick={handleCloseClaimModal}>
                        Cancel
                    </div>
                </div>
            </Box>
        </Modal>
    );
}

export default ClaimModal;
