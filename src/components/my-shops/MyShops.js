import React, { useState, Suspense, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import Card from "@mui/material/Card";

import CardContent from "@mui/material/CardContent";

import AddBoxIcon from "@mui/icons-material/AddBox";
import Avatar from "@mui/material/Avatar";

import "../../lib/scss/components/my-shops/my-shop.scss";

import { db } from "../../services/firebase/firebase-config";

import Shops from "./Shops";

function Shop() {
    const { authUser } = useContext(UserContext);
    const [shops, setShops] = useState([]);

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

    return (
        <div className="shop-container">
            <Card className="shop-wrapper">
                <CardContent>
                    <div className="shop-header">
                        <h3>Your Shops</h3>
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
