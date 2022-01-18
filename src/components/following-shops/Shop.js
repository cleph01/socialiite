import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../../services/firebase/firebase-config";

import Skeleton from "@mui/material/Skeleton";

import ListItem from "@mui/material/ListItem";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";

import "../../lib/scss/components/partner-shops/shop.scss";

function Shop({ business }) {
    console.log("Shop Item: ", business);

    if (!business) {
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
        <div className="">
            <Link
                to={`/shops/${business.businessId}`}
                style={{ textDecoration: "none", color: "inherit" }}
            >
                <Divider />
                <ListItem>
                    <ListItemAvatar>
                        <Avatar src={business.logoUrl} />
                    </ListItemAvatar>
                    <div className="bla">
                        <Typography type="headline" component="h2">
                            {business.businessName}
                        </Typography>
                    </div>
                    <ListItemSecondaryAction
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            width: "60px",
                        }}
                    >
                        <div
                            style={{ fontSize: "24px" }}
                            onClick={() => {
                                alert("Clicked");
                            }}
                        >
                            👀
                        </div>
                    </ListItemSecondaryAction>
                </ListItem>
                <Divider />
            </Link>
        </div>
    );
}

export default React.memo(Shop);
