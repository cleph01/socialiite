import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { db, firebase } from "../../../services/firebase/firebase-config";

import WalletItems from "./WalletItems";
import OfferList from "./OfferList";

import Box from "@mui/material/Box";

import Divider from "@mui/material/Divider";

import Skeleton from "@mui/material/Skeleton";

import Modal from "@mui/material/Modal";

const style = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 350,
    height: 700,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    overflow: "scroll",
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

function MakeOffer({
    prize,
    wallet,
    setWallet,
    openMakeOfferModal,
    handleCloseMakeOfferModal,
    setOpenSnackBar,
    setAlertMsg,
}) {
    const { authUser } = useContext(UserContext);

    const [walletIndex, setWalletIndex] = useState(0);

    const [offers, setOffers] = useState([]);

    const removeFromOffer = (item) => {
        setOffers((prevState) =>
            prevState.filter(
                (offer) => offer.walletItemId !== item.walletItemId
            )
        );

        setWallet((prevState) => [...prevState, item]);
    };

    const handleSubmitOffer = () => {
        if (offers.length > 0) {
            let tradeOffer = { bidderId: authUser.uid, offer: {} };
            offers.forEach((offerItem, i) => {
                tradeOffer.offer[i] = {
                    businessId: offerItem.businessId,
                    businessName: offerItem.businessName,
                    emoji: offerItem.emoji,
                    itemDescription: offerItem.itemDescription,
                    pointCost: offerItem.pointCost,
                    walletItemId: offerItem.walletItemId,
                };
            });

            // Check if trade with this prizeId already exists
            db.collection("trades")
                .where("walletItemId", "==", prize.walletItemId)
                .get()
                .then((querySnapshot) => {
                    console.log("Trades SnapShot: ", querySnapshot);
                    if (querySnapshot.docs.length > 0) {
                        let dbTradeOffers =
                            querySnapshot.docs[0].data().tradeOffers;

                        const updatedTradeOffer = [...dbTradeOffers];

                        updatedTradeOffer.push(tradeOffer);

                        console.log("Updated Trade Offer: ", updatedTradeOffer);

                        db.collection("trades")
                            .doc(querySnapshot.docs[0].id)
                            .update({
                                tradeOffers: updatedTradeOffer,
                            })
                            .then(() => {
                                offers.forEach((offer) => {
                                    db.collection("wallet")
                                        .doc(offer.walletItemId)
                                        .update({
                                            offeredInTrade: true,
                                        })
                                        .then(() => {
                                            console.log(
                                                "Successfully Updated OfferedInTrade"
                                            );
                                        })
                                        .catch((error) => {
                                            console.log(
                                                "Error Updating OfferedInTrade"
                                            );
                                        });
                                });

                                // Empty Offer State
                                setOffers([]);

                                // Reset the Wallet to Remove Offered for Trade
                                // Try and Optimize -> O(n^2)
                                let newWallet = [];
                                for (let i = 0; i < wallet.length; i++) {
                                    for (let j = 0; j < offers.length; j++) {
                                        if (
                                            offers[j].walletItemId !==
                                            wallet[i].walletItemId
                                        ) {
                                            newWallet.push(wallet[i]);
                                        }
                                    }
                                }
                                // set Wallet with new value
                                setWallet(newWallet);

                                setAlertMsg({
                                    message: "Successfully Updated Trade",
                                    severity: "success",
                                });

                                setOpenSnackBar(true);

                                handleCloseMakeOfferModal();
                            })
                            .catch((error) => {
                                console.log("Error Submitting Trade: ", error);

                                setAlertMsg({
                                    message: "Error Submitting Trade.",
                                    severity: "error",
                                });

                                setOpenSnackBar(true);

                                handleCloseMakeOfferModal();
                            });
                    } else {
                        // Add new trade record
                        db.collection("trades")
                            .add({
                                ownerId: prize.userId,
                                walletItemId: prize.walletItemId,
                                description: prize.itemDescription,
                                emoji: prize.emoji,
                                tradeOffers: [tradeOffer],
                                businessName: prize.businessName,
                                businessId: prize.businessId,
                                settled: false,
                                pointCost: prize.pointCost,
                            })
                            .then((docRef) => {
                                console.log("Trade Offer: ", tradeOffer);

                                offers.forEach((offer) => {
                                    db.collection("wallet")
                                        .doc(offer.walletItemId)
                                        .update({
                                            offeredInTrade: true,
                                        })
                                        .then(() => {
                                            console.log(
                                                "Successfully Updated OfferedInTrade"
                                            );
                                        })
                                        .catch((error) => {
                                            console.log(
                                                "Error Updating OfferedInTrade"
                                            );
                                        });
                                });

                                // Empty Offer State
                                setOffers([]);

                                // Reset the Wallet to Remove Offered for Trade
                                // Try and Optimize -> O(n^2)
                                let newWallet = [];
                                for (let i = 0; i < wallet.length; i++) {
                                    for (let j = 0; j < offers.length; j++) {
                                        if (
                                            offers[j].walletItemId !==
                                            wallet[i].walletItemId
                                        ) {
                                            newWallet.push(wallet[i]);
                                        }
                                    }
                                }
                                // set Wallet with new value
                                setWallet(newWallet);

                                setAlertMsg({
                                    message: "Successfully Submitted Trade",
                                    severity: "success",
                                });

                                setOpenSnackBar(true);

                                handleCloseMakeOfferModal();
                            })
                            .catch((error) => {
                                setAlertMsg({
                                    message: "Error Submitting Trade",
                                    severity: "error",
                                });

                                setOpenSnackBar(true);

                                handleCloseMakeOfferModal();
                            });
                    }
                });
        } else {
            setAlertMsg({
                message: "No Items Selected",
                severity: "error",
            });

            setOpenSnackBar(true);
            handleCloseMakeOfferModal();
        }
    };

    const handleChange = (event) => {
        const isChecked = event.target.checked;
        if (isChecked) {
            setOffers((prevState) => {
                return [...prevState, event.target.value];
            });
        } else {
            const index = offers.indexOf(event.target.value);

            setOffers((prevState) => {
                return prevState.filter((elem, i) => index !== i);
            });
        }
    };

    console.log("Prize Wallet Id Make Offer: ", prize.walletItemId);

    console.log("wallet Hash in Make oFfer: ", wallet);
    console.log("Offer: ", offers);

    return (
        <Modal
            open={openMakeOfferModal}
            onClose={handleCloseMakeOfferModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <h2>Make an Offer</h2>

                <div style={{ fontSize: "96px" }}>{prize.emoji}</div>
                <div style={{ fontSize: "26px", color: "#282a35" }}>
                    {prize.itemDescription}
                </div>
                <div
                    style={{
                        fontWeight: "700",
                        margin: "10px 0px 10px",
                        color: "#282a35",
                    }}
                >
                    by {prize.businessName}
                </div>

                <div
                    style={{
                        fontWeight: "700",
                        margin: "10px 0px 10px",
                        fontSize: "36px",
                        color: "#282a35",
                    }}
                >
                    {prize.pointCost > 1
                        ? `${prize.pointCost} Points`
                        : `${prize.pointCost} Point`}
                </div>

                <Divider sx={{ width: "100%" }} />

                <h3>My Wallet 👇</h3>

                <WalletItems
                    wallet={wallet}
                    setWallet={setWallet}
                    setWalletIndex={setWalletIndex}
                    walletIndex={walletIndex}
                    setOffers={setOffers}
                />

                {offers && (
                    <OfferList
                        offers={offers}
                        removeFromOffer={removeFromOffer}
                    />
                )}

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center",
                        marginTop: "15px",
                    }}
                >
                    <div style={redeemStyle} onClick={handleSubmitOffer}>
                        Make Offer
                    </div>
                    <div
                        style={cancelStyle}
                        onClick={() => {
                            handleCloseMakeOfferModal();
                            setOffers([]);
                        }}
                    >
                        Cancel
                    </div>
                </div>
            </Box>
        </Modal>
    );
}

export default MakeOffer;
