import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { db, firebase } from "../../../services/firebase/firebase-config";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import VisibilityIcon from "@mui/icons-material/Visibility";

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

function MakeOffer({
    prize,
    openMakeOfferModal,
    handleCloseMakeOfferModal,
    setOpenSnackBar,
    setAlertMsg,
}) {
    const { authUser } = useContext(UserContext);

    const [wallet, setWallet] = useState();
    const [offer, setOffer] = useState([]);

    const handleSubmitOffer = () => {
        if (wallet.length > 0) {
            let tradeOffer = [];
            offer.forEach((offerItem) => {
                for (let i = 0; i < wallet.length; i++) {
                    if (offerItem === wallet[i].walletItemId) {
                        tradeOffer.push(wallet[i]);
                    }
                }
            });
            console.log("Prize Wallet Id: ", prize.walletItemId);

            db.collection("trades")
                .where("walletItemId", "==", prize.walletItemId)
                .get()
                .then((querySnapshot) => {
                    console.log("Trades SnapShot: ", querySnapshot);
                    if (querySnapshot.docs.length > 0) {
                        let dbTradeOffers =
                            querySnapshot.docs[0].data().tradeOffers;

                        tradeOffer = [...tradeOffer, ...dbTradeOffers];

                        db.collection("trades")
                            .doc(querySnapshot.docs[0].id)
                            .update({
                                tradeOffers: tradeOffer,
                            })
                            .then(() => {
                                offer.forEach((walletItemId) => {
                                    db.collection("wallet")
                                        .doc(walletItemId)
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
                                setOffer([]);

                                // Reset the Wallet to Remove Offered for Trade
                                let newWallet = [];
                                for (let i = 0; i < wallet.length; i++) {
                                    if (
                                        !offer.includes(wallet[i].walletItemId)
                                    ) {
                                        newWallet.push(wallet[i]);
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
                                tradeOffers: tradeOffer,
                                businessName: prize.businessName,
                                businessId: prize.businessId,
                            })
                            .then((docRef) => {
                                console.log("Trade Offer: ", tradeOffer);

                                offer.forEach((walletItemId) => {
                                    db.collection("wallet")
                                        .doc(walletItemId)
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
                                setOffer([]);

                                // Reset the Wallet to Remove Offered for Trade
                                let newWallet = [];
                                for (let i = 0; i < wallet.length; i++) {
                                    if (
                                        !offer.includes(wallet[i].walletItemId)
                                    ) {
                                        newWallet.push(wallet[i]);
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
                message: "Wallet is Empty",
                severity: "error",
            });

            setOpenSnackBar(true);
            handleCloseMakeOfferModal();
        }
    };

    const handleChange = (event) => {
        const isChecked = event.target.checked;
        if (isChecked) {
            setOffer((prevState) => {
                return [...prevState, event.target.value];
            });
        } else {
            const index = offer.indexOf(event.target.value);

            setOffer((prevState) => {
                return prevState.filter((elem, i) => index !== i);
            });
        }
    };

    useEffect(() => {
        db.collection("wallet")
            .where("userId", "==", authUser.uid)
            .where("offeredInTrade", "==", false)
            .get()
            .then((items) => {
                console.log("Wallet Items in MakeOffer: ", items);

                setWallet(
                    items.docs.map((doc) => ({
                        walletItemId: doc.id,
                        ...doc.data(),
                    }))
                );
                // const rawWallet = items.docs.map((doc) => ({
                //     walletItemId: doc.id,
                //     ...doc.data(),
                // }));

                // let newArr = [];
                // // Filter out items
                // for (let i = 0; i < rawWallet.length; i++) {
                //     if (rawWallet[i].userId === authUser.uid) {
                //         newArr.push(rawWallet[i]);
                //     }
                // }

                // setWallet(newArr);
            })
            .catch((error) => {
                console.log("Error Getting Wallet Items: ", error);
            });
    }, []);

    if (!wallet) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "10px",
                }}
            >
                <Skeleton variant="rectangular" width={350} height={218} />
            </div>
        );
    }

    console.log("Wallet in make Offer: ", wallet);
    console.log("Offer: ", offer);
    return (
        <Modal
            open={openMakeOfferModal}
            onClose={handleCloseMakeOfferModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <h2>Make an Offer</h2>
                <h3>Target Prize</h3>
                <h4>{prize.itemDescription}</h4>
                <div style={{ fontWeight: "700", margin: "6px 0px 10px" }}>
                    @ {prize.businessName}
                </div>

                <div style={{ fontSize: "36px" }}>{prize.emoji}</div>

                <Divider sx={{ color: "#000" }} />

                <h3>My Wallet 👇</h3>
                <List
                    className="product-list-container"
                    sx={{ width: "100%", maxHeight: "300px", overflow: "auto" }}
                >
                    <Divider />
                    {wallet.map((item, index) => (
                        <span key={index}>
                            <ListItem className="product-list-item">
                                <ListItemAvatar>
                                    <Avatar
                                        sx={{ width: 46, height: 46 }}
                                        loading="lazy"
                                    >
                                        <span style={{ fontSize: "36px" }}>
                                            {item.emoji}
                                        </span>
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={item.itemDescription}
                                    secondary={item.businessName}
                                />
                                <ListItemSecondaryAction>
                                    <input
                                        type="checkbox"
                                        style={{ transform: "scale(2)" }}
                                        onChange={handleChange}
                                        value={item.walletItemId}
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                            <Divider />
                        </span>
                    ))}
                </List>
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
                        onClick={handleCloseMakeOfferModal}
                    >
                        Cancel
                    </div>
                </div>
            </Box>
        </Modal>
    );
}

export default MakeOffer;
