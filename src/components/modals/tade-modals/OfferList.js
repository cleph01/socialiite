import React from "react";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";

function OfferList({ offers, removeFromOffer }) {
    return (
        <List sx={{ width: "90%", overflow: "scroll", maxHeight: "300px" }}>
            {offers.map((offer, i) => (
                <div key={i}>
                    <Divider />
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>{offer.emoji}</Avatar>
                        </ListItemAvatar>

                        <ListItemText
                            primary={offer.itemDescription}
                            secondary={
                                <>
                                    <>{offer.businessName}</>
                                    <>{offer.pointCost}</>
                                </>
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
                                onClick={() => {
                                    removeFromOffer(offer);
                                }}
                            >
                                ❌
                            </div>
                        </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                </div>
            ))}
        </List>
    );
}

export default OfferList;
