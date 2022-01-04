import React, { useState, Suspense, useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import Card from "@mui/material/Card";

import CardContent from "@mui/material/CardContent";

import AddBoxIcon from "@mui/icons-material/AddBox";
import Avatar from "@mui/material/Avatar";

import "../../lib/scss/components/my-shops/my-shop.scss";

import { db, firebase } from "../../services/firebase/firebase-config";

import Shops from "./Shops";

function Shop() {
    const history = useHistory();
    const { userState, authUser } = useContext(UserContext);
    const [shops, setShops] = useState([]);

    const sendToCustomerPortal = () => {
        window.location.assign(userState.stripeLink);
    };

    useEffect(() => {
        db.collection("shops")
            .where("ownerId", "==", authUser.uid)
            .get()
            .then((querySnapshot) => {
                if (querySnapshot.docs.length > 0) {
                    setShops(
                        querySnapshot.docs.map((doc) => ({
                            businessId: doc.id,
                            ...doc.data(),
                        }))
                    );
                }
            })
            .catch((error) => {
                console.log("Error Getting My Shops: ", error);
            });
    }, []);

    console.log("UserState in myShops: ", userState);

    return (
        <div className="shop-container">
            <Card className="shop-wrapper">
                <CardContent>
                    <div className="shop-header">
                        <h3>Your Shops</h3>
                        <div
                            className="billing-btn"
                            onClick={sendToCustomerPortal}
                        >
                            Billing
                        </div>
                        <Link to="/hero/my-shops/new">
                            <div className="add-shop-btn">
                                <AddBoxIcon />
                                New Shop
                            </div>
                        </Link>
                    </div>
                    <Suspense fallback={<div>Loading...</div>}>
                        <Shops shops={shops} />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    );
}

export default Shop;
