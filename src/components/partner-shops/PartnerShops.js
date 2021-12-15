import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import List from "@mui/material/List";

import Skeleton from "@mui/material/Skeleton";

import { db } from "../../services/firebase/firebase-config";

import Shop from "./Shop";
import UpcomingMessage from "../UpcomingMessage";

function PartnerShops() {
    const [bizRelationships, setBizRelationships] = useState();

    const { authUser } = useContext(UserContext);
    useEffect(() => {
        db.collection("users")
            .doc(authUser.uid)
            .collection("bizRelationships")
            .get()
            .then((bizRelationships) => {
                console.log("Biz Relationships in query: ", bizRelationships);

                setBizRelationships(
                    bizRelationships.docs.map((doc) => ({
                        businessId: doc.id,
                        business: doc.data(),
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
                bizRelationships.map((bizRelationship, i) => (
                    <Shop key={i} bizRelationship={bizRelationship} />
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
