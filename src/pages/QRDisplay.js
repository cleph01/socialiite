import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import QRcodeGen from "./components/QRcodeGen";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";

import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

import "./styles/store.scss";

import socialiite from "../../assets/images/logos/logo_white_text.png";
import productPic from "../../assets/images/chickenshack-product.jpg";

import { db } from "../../firebase/firebase_config";

function Store() {
    const { shopId } = useParams();

    const [businessInfo, setBusinessInfo] = useState();

    // const todaysDate = Date.now();

    useEffect(() => {
        db.collection("shops")
            .doc(shopId)
            .get()
            .then((doc) => {
                setBusinessInfo(doc.data());
            })
            .catch((err) => {
                console.log("Error getting Business Info: ", err);
            });
    }, []);

    if (!businessInfo) {
        return <div>...Loading Store</div>;
    }

    return (
        <div className="container">
            <Card sx={{ maxWidth: 645 }}>
                <CardHeader
                    avatar={
                        <Avatar
                            src={businessInfo.logoUrl}
                            sx={{
                                /* bgcolor: red[500],*/
                                width: 50,
                                height: 50,
                                margin: "auto",
                                padding: "10px",
                                border: "1px solid #f0f0f0",
                            }}
                        />
                    }
                    title={businessInfo.businessName}
                    subheader={`${businessInfo.address}, ${businessInfo.city} ${businessInfo.state}`}
                />
                <div className="body-wrapper">
                    <CardMedia
                        component="img"
                        height="194"
                        image={productPic}
                        alt="Paella dish"
                        loading="lazy"
                        sx={{ marginRight: "30px" }}
                    />
                    <QRcodeGen />
                </div>
                <CardContent>
                    <br />
                    <Typography
                        variant="h4"
                        color="text.secondary"
                        sx={{ textAlign: "center" }}
                    >
                        Scan and Win a Boatload of Prizes!
                    </Typography>
                </CardContent>
                <CardActions disableSpacing className="footer">
                    <img
                        className="socialiite-logo"
                        src={socialiite}
                        alt="socialiite"
                    />
                </CardActions>
            </Card>
        </div>
    );
}

export default Store;
