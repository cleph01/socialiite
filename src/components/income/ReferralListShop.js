import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ListItem from "@mui/material/ListItem";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";

import Skeleton from "@mui/material/Skeleton";

import { db } from "../../services/firebase/firebase-config";

function ReferralListShop({ businessId }) {
    const [business, setBusiness] = useState();

    useEffect(() => {
        db.collection("shops")
            .doc(businessId)
            .get()
            .then((doc) => {
                setBusiness(doc.data());
            })
            .catch((error) => {
                console.log("Error GEtting Biz Relationships: ", error);
            });
    }, []);

    if (!business) {
        return (
            <p
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "10px",
                }}
            >
                <Skeleton variant="rectangular" width={350} height={218} />
            </p>
        );
    }

    return (
        <span>{business.businessName}</span>
    );
}

export default ReferralListShop;
