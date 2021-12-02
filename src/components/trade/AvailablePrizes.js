import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";

import Skeleton from "@mui/material/Skeleton";
import UpcomingMessage from "../UpcomingMessage";

import { db } from "../../services/firebase/firebase-config";

import "../../lib/scss/components/trade-room/available-prizes.scss";

function AvailablePrizes({
    setPrize,
    setOpenMakeOfferModal,
    setOpenAvailablePrizeModal,
}) {
    const [availablePrizes, setAvailablePrizes] = useState();

    const { authUser } = useContext(UserContext);

    useEffect(() => {
        const unsubscribe = db
            .collection("wallet")
            .where("publicWallet", "==", true)
            .where("redeemed", "==", false)
            .where("offeredInTrade", "==", false)
            .onSnapshot(
                (snapshot) => {
                    console.log("Available Prizes: ", snapshot);

                    const rawWallet = snapshot.docs.map((doc) => ({
                        walletItemId: doc.id,
                        ...doc.data(),
                    }));

                    let newArr = [];

                    for (let i = 0; i < rawWallet.length; i++) {
                        if (rawWallet[i].userId !== authUser.uid) {
                            newArr.push(rawWallet[i]);
                        }
                    }

                    setAvailablePrizes(newArr);
                },
                (error) => {
                    console.log(
                        "error getting Public Wallet collectionGroup: ",
                        error
                    );
                }
            );

        return () => {
            unsubscribe();
        };
    }, []);

    if (!availablePrizes) {
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

    if (availablePrizes.length === 0) {
        return (
            <div
                style={{
                    width: "90vmin",
                    padding: "10px",
                    borderRadius: "5px",
                    marginBottom: "6px",
                    backgroundColor: "#fff",
                    opacity: 0.85,
                }}
            >
                <h3>Available Prizes</h3>
                <UpcomingMessage message="Prizes Coming" emoji="🎁" />
            </div>
        );
    }

    return (
        <div className="available-prizes__wrapper">
            <h3>Available Prizes</h3>
            <List
                className="product-list-container"
                sx={{ maxHeight: "300px", overflow: "auto" }}
            >
                {availablePrizes.map((item, i) => (
                    <span key={i}>
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
                                secondary={`${item.businessName} | ${item.pointCost} points`}
                            />
                            <ListItemSecondaryAction
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    width: "60px",
                                }}
                            >
                                {/* <div
                                    style={{ fontSize: "24px" }}
                                    onClick={() => {
                                        setPrize({ ...item });
                                        setOpenAvailablePrizeModal(true);
                                    }}
                                >
                                    👀
                                </div> */}

                                <div
                                    style={{ fontSize: "24px" }}
                                    onClick={() => {
                                        setPrize({ ...item });
                                        setOpenMakeOfferModal(true);
                                    }}
                                >
                                    🤝
                                </div>
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                    </span>
                ))}
            </List>
        </div>
    );
}

export default AvailablePrizes;
