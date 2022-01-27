import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../../services/firebase/firebase-config";

import Skeleton from "@mui/material/Skeleton";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";

import "../../lib/scss/components/my-shops/edit-prize-list.scss";

function EditPrizeList({ businessId }) {
    const [prizes, setPrizes] = useState();

    useEffect(() => {
        db.collection("prizes")
            .where("businessId", "==", businessId)
            .get()
            .then((prizeList) => {
                console.log("Prize List in query: ", prizeList);

                setPrizes(
                    prizeList.docs.map((doc) => ({
                        prizeId: doc.id,
                        ...doc.data(),
                    }))
                );
            })
            .catch((error) => {
                console.log("Error GEtting Price List: ", error);
            });
    }, [businessId]);

    if (!prizes) {
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

    return (
        <div className="edit-prizes__container">
            <h3 className="delete-prize-header">Current Prizes</h3>
            <List className="prize-list__wrapper">
                {prizes.map((item, i) => (
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
                                secondary={
                                    <span>
                                        Incentive:{" "}
                                        <span>
                                            {item.incentive ? " true" : "false"}
                                        </span>
                                        <br />
                                        <span>
                                            <span>Tags: </span>

                                            {item.tags.map((tag, i) => (
                                                <span key={i}>
                                                    {tag}
                                                    {i === item.tags.length - 1
                                                        ? null
                                                        : ","}{" "}
                                                </span>
                                            ))}
                                        </span>
                                        <br />
                                        <span>
                                            Point Cost: {item.pointCost}
                                        </span>
                                    </span>
                                }
                            />
                            <ListItemSecondaryAction
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    width: "60px",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: "24px",
                                        marginRight: "20px",
                                    }}
                                >
                                    ❌
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

export default React.memo(EditPrizeList);
