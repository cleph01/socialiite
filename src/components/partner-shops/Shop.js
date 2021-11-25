import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../../services/firebase/firebase-config";

import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";

function Shop({ shop }) {
    const [prizes, setPrizes] = useState();

    console.log("Shop Item: ", shop);
    useEffect(() => {
        db.collection("shops")
            .doc(shop.shopId)
            .collection("prizes")
            .get()
            .then((prizes) => {
                console.log("Prizes in Shop query: ", prizes);
                setPrizes(
                    prizes.docs.map((doc) => ({
                        prizeId: doc.id,
                        prizes: doc.data(),
                    }))
                );
            })
            .catch((error) => {
                console.log("Error Shop Info: ", error);
            });
    }, []);

    if (!prizes) {
        return <div>...Loading Prize Count</div>;
    }
    return (
        <div>
            <Link
                to={`/shops/${shop.shopId}`}
                style={{ textDecoration: "none", color: "inherit" }}
            >
                <Divider />
                <ListItem>
                    <ListItemAvatar>
                        <Avatar src={shop.logoUrl} />
                    </ListItemAvatar>
                    <div className="bla">
                        <Typography type="headline" component="h2">
                            {shop.businessName}
                        </Typography>
                        <Typography type="subheading" component="h4">
                            Likes: {shop.likes.length} | Prizes: {prizes.length}
                        </Typography>
                    </div>
                </ListItem>
                <Divider />
            </Link>
        </div>
    );
}

export default React.memo(Shop);
