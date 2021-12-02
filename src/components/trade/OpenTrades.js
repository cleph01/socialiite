import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { db } from "../../services/firebase/firebase-config";

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
import UpcomingMessage from "../UpcomingMessage";

import "../../lib/scss/components/trade-room/open-trades.scss";

function OpenTrades() {
    const [openTrades, setOpenTrades] = useState();

    useEffect(() => {
        const unsubscribe = db.collection("trades").onSnapshot(
            (snapshot) => {
                console.log("Open Trades: ", snapshot);
                setOpenTrades(
                    snapshot.docs.map((doc) => ({
                        tradeId: doc.id,
                        ...doc.data(),
                    }))
                );
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

    console.log("Open Trades render: ", openTrades);
    if (!openTrades) {
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

    if (openTrades.length === 0) {
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
                <h3>Trading Now</h3>
                <UpcomingMessage message="Trades Coming" emoji="🤝" />
            </div>
        );
    }

    return (
        <div className="open-trades__wrapper">
            <h3>Trading Now</h3>
            <List
                className="product-list-container"
                sx={{ maxHeight: "300px", overflow: "auto" }}
            >
                {openTrades.map((item, i) => (
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
                                primary={item.description}
                                secondary={`${item.businessName} | ${item.tradeOffers.length} bids`}
                            />
                            <ListItemSecondaryAction>
                                <div style={{ fontSize: "24px" }}>👀</div>
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                    </span>
                ))}
            </List>
        </div>
    );
}

export default OpenTrades;
