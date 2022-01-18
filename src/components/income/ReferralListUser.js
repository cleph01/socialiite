import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";

import Skeleton from "@mui/material/Skeleton";

import { db } from "../../services/firebase/firebase-config";
import ReferralListShop from "./ReferralListShop";

function ReferralListUser({ referral }) {
    const [user, setUser] = useState();

    useEffect(() => {
        db.collection("users")
            .doc(referral.referred)
            .get()
            .then((doc) => {
                setUser(doc.data());
            })
            .catch((error) => {
                console.log("Error GEtting Biz Relationships: ", error);
            });
    }, []);

    if (!user) {
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
        <Link
            to={`/users/${referral.referred}`}
            style={{ textDecoration: "none", color: "inherit" }}
        >
            <Divider />
            <ListItem>
                <ListItemAvatar>
                    <Avatar src={user.avatarUrl} />
                </ListItemAvatar>
                <ListItemText
                    primary={
                        <>
                            <span>{user.displayName}</span>
                            <span> | </span>
                            <span>
                                {referral.paid
                                    ? "Payment: Paid"
                                    : "Payment: Owed"}
                            </span>
                        </>
                    }
                    secondary={
                        <ReferralListShop businessId={referral.businessId} />
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
    );
}

export default ReferralListUser;
