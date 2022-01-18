import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import List from "@mui/material/List";

import Skeleton from "@mui/material/Skeleton";

import { db } from "../../services/firebase/firebase-config";

import Shop from "./Shop";
import UpcomingMessage from "../UpcomingMessage";

import "../../lib/scss/components/partner-shops/partner-shops.scss";

function FollowingShops() {
    const [followingShops, setFollowingShops] = useState([]);

    const { userState } = useContext(UserContext);
    useEffect(() => {
        // for loop through Following Businesses Array
        console.log("UserState at FollowingShops: ", userState);

        if (userState) {
            userState?.followingBusinesses.forEach((businessId) => {
                db.collection("shops")
                    .doc(businessId)
                    .get()
                    .then((doc) => {
                        setFollowingShops((prevState) => [
                            ...prevState,
                            { businessId: doc.id, ...doc.data() },
                        ]);
                    })
                    .catch((error) => {
                        console.log("Error GEtting Biz Relationships: ", error);
                    });
            });
        }
    }, [userState]);

    // if (!followingShops) {
    //     return (
    //         <div
    //             style={{
    //                 display: "flex",
    //                 justifyContent: "center",
    //                 alignItems: "center",
    //                 marginTop: "10px",
    //             }}
    //         >
    //             <Skeleton variant="rectangular" width={350} height={218} />
    //         </div>
    //     );
    // }

    console.log("BizRelationships in PartnerShops: ", followingShops);
    return (
        <div className="partner-shops-container">
            <h3>Following Shops</h3>
            <List className="partner-shops-wrapper">
                {followingShops.length > 0 ? (
                    followingShops.map((business, i) => (
                        <Shop key={i} business={business} />
                    ))
                ) : (
                    <UpcomingMessage
                        message="Follow A Business, Show the World Why They're Awesome, And Get Paid!!"
                        emoji="🚀"
                    />
                )}
            </List>
        </div>
    );
}

export default FollowingShops;
