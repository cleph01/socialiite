import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import List from "@mui/material/List";

import AvailablePrizeItem from "./AvailablePrizeItem";

import Skeleton from "@mui/material/Skeleton";

import Divider from "@mui/material/Divider";

import "../../lib/scss/components/shops/available-prize-list.scss";

import { db } from "../../services/firebase/firebase-config";

function AvailablePrizes({ businessId, handleOpenClaimModal }) {
    const [prizes, setPrizes] = useState();

    useEffect(() => {
        db.collection("shops")
            .doc(businessId)
            .collection("prizes")
            .get()
            .then((querySnapshot) => {
                setPrizes(
                    querySnapshot.docs.map((doc) => ({
                        prizeId: doc.id,
                        prize: doc.data(),
                    }))
                );
            })
            .catch((err) => {
                console.log("Error getting Prizes: ", err);
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
                className="hero-home__container"
            >
                <Skeleton variant="rectangular" width={350} height={218} />
            </div>
        );
    }

    return (
        <List className="prize-list-container">
            {prizes.map((prize, i) => (
                <div key={i}>
                    <AvailablePrizeItem
                        prize={prize}
                        handleOpenClaimModal={handleOpenClaimModal}
                    />
                    <Divider />
                </div>
            ))}
        </List>
    );
}

export default AvailablePrizes;
