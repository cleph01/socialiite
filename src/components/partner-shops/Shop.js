import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../../services/firebase/firebase-config";

import Skeleton from "@mui/material/Skeleton";

import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";

function Shop({ bizRelationship }) {
    const [prizes, setPrizes] = useState();
    const [business, setBusiness] = useState();

    console.log("Shop Item: ", bizRelationship);
    useEffect(() => {
        db.collection("shops")
            .doc(bizRelationship.businessId)
            .get()
            .then((doc) => {
                console.log("doc in shop business: ", doc);
                setBusiness({
                    businessId: doc.id,
                    ...doc.data(),
                });
            })
            .catch((error) => {
                console.log("Error getting Business Info: ", error);
            });

        db.collection("shops")
            .doc(bizRelationship.businessId)
            .collection("prizes")
            .get()
            .then((querySnapshot) => {
                console.log("Prizes in Shop query: ", querySnapshot);
                setPrizes(
                    querySnapshot.docs.map((doc) => ({
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
        <div>
            <Link
                to={`/shops/${bizRelationship.businessId}`}
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
                            Your Points: {bizRelationship.business.pointSum} |
                            Prizes: {prizes.length}
                        </Typography>
                    </div>
                </ListItem>
                <Divider />
            </Link>
        </div>
    );
}

export default React.memo(Shop);
