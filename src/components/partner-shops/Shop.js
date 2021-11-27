import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../../services/firebase/firebase-config";

import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";

function Shop({ business }) {
    const [prizes, setPrizes] = useState();

    console.log("Shop Item: ", business);
    useEffect(() => {
        db.collection("shops")
            .doc(business.businessId)
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
                        <Typography type="subheading" component="h4">
                            Likes: {business.likes.length} | Prizes:{" "}
                            {prizes.length}
                        </Typography>
                    </div>
                </ListItem>
                <Divider />
            </Link>
        </div>
    );
}

export default React.memo(Shop);
