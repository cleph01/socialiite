import { useEffect, useState } from "react";

import List from "@mui/material/List";

import Skeleton from "@mui/material/Skeleton";

import { db } from "../../services/firebase/firebase-config";

import Shop from "./Shop";
import UpcomingMessage from "../UpcomingMessage";

function PartnerShops() {
    const [bizRelationships, setBizRelationships] = useState();

    useEffect(() => {
        const authUser = localStorage.getItem("authUser");

        db.collection("user")
            .doc(authUser.uid)
            .collection("bizRelationships")
            .get()
            .then((bizRelationships) => {
                console.log("Biz Relationships in query: ", bizRelationships);

                setBizRelationships(
                    bizRelationships.docs.map((doc) => ({
                        relationshipId: doc.id,
                        relationship: doc.data(),
                    }))
                );
            })
            .catch((error) => {
                console.log("Error GEtting Biz Relationships: ", error);
            });
    }, []);

    if (!bizRelationships) {
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

    console.log("BizRelationships in PartnerShops: ", bizRelationships);
    return (
        <List
            sx={{
                width: "90vmin",

                bgcolor: "background.paper",
                borderRadius: "5px",
            }}
        >
            {bizRelationships.length > 0 ? (
                bizRelationships.map((business, i) => (
                    <Shop key={business.businessId} business={business} />
                ))
            ) : (
                <UpcomingMessage
                    message="Connect With A Business, Show the World Why They're Awesome, And Get Paid!!"
                    emoji="🚀"
                />
            )}
        </List>
    );
}

export default PartnerShops;
