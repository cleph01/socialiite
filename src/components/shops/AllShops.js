import React, { lazy, Suspense } from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import { makeStyles } from "@mui/styles";
import Nav from "../components/nav_bar/Nav";

import "../styles/shop/all_shops.scss";

const Shops = lazy(() => import("./shops/AllShops"));

const useStyles = makeStyles((theme) => ({
    card: {
        maxWidth: 600,
        margin: "auto",
        textAlign: "center",
        marginTop: "100px",
        paddingBottom: "10px",
    },
}));

function AllShops() {
    const classes = useStyles();

    return (
        <div className="shop-container">
            <Card className={classes.card}>
                <CardContent>
                    <Typography variant="h5">All Shops</Typography>

                    <Suspense fallback={<div>Loading...</div>}>
                        <Shops />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    );
}

export default AllShops;
