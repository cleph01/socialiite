import React, { useEffect, useState } from "react";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";

import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";

import Skeleton from "@mui/material/Skeleton";

import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import ShareIcon from "@mui/icons-material/Share";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import PhoneIcon from "@mui/icons-material/Phone";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import CheckIcon from "@mui/icons-material/Check";

import { db } from "../../services/firebase/firebase-config";

import "../../lib/scss/components/wallet/wallet-item.scss";

const WalletItem = ({
    itemDetails,
    setShareBusiness,
    handleOpen,
    itemId,
    setOpenShareModal,
}) => {
    const [business, setBusiness] = useState();

    useEffect(() => {
        db.collection("shops")
            .doc(itemDetails.businessId)
            .get()
            .then((doc) => {
                setBusiness(doc.data());
            })
            .catch((err) => {
                console.log("Error geting Business Info: ", err);
            });
    }, []);

    if (!business) {
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
        <>
            <Card
                sx={{
                    maxWidth: 345,
                    marginBottom: "20px",
                    boxShadow:
                        "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                }}
            >
                <CardHeader
                    className="header"
                    avatar={
                        <Avatar
                            src={business.logoUrl}
                            sx={{
                                width: 50,
                                height: 50,
                                margin: "auto",
                                padding: "10px",
                                border: "1px solid #f0f0f0",
                            }}
                        />
                    }
                    action={
                        <a
                            href={`tel:${business.phone}`}
                            style={{ textDecoration: "none" }}
                        >
                            <IconButton aria-label="settings">
                                <PhoneIcon />
                            </IconButton>
                        </a>
                    }
                    title={business.businessName}
                    subheader={`${business.address}, ${business.city} ${business.state}`}
                />
                {/* <CardMedia
                    component="img"
                    height="194"
                    image={productPic}
                    alt="Paella dish"
                    loading="lazy"
                /> */}
                <div className="wallet-item-emoji">{itemDetails.emoji}</div>
                <CardContent>
                    <Typography
                        className="description"
                        variant="h4"
                        color="text.secondary"
                    >
                        {itemDetails.itemDescription}
                    </Typography>
                    <br />
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        style={{ textAlign: "center" }}
                    >
                        Shoutout, Trade, or Redeem below
                    </Typography>
                </CardContent>
                <CardActions disableSpacing className="footer">
                    {/* <IconButton aria-label="fire">
                        <LocalFireDepartmentIcon />
                    </IconButton> */}
                    <IconButton
                        aria-label="share"
                        onClick={() => {
                            setShareBusiness({
                                businessId: itemDetails.businessId,
                                businessName: itemDetails.businessName,
                            });
                            setOpenShareModal(true);
                            console.log(
                                "Business at Wallet Item: ",
                                itemDetails.businessId
                            );
                        }}
                    >
                        <ShareIcon className="icon" />
                    </IconButton>
                    <IconButton aria-label="trade">
                        {/* <CompareArrowsIcon className="icon" /> */}
                        <div>&nbsp;</div>
                    </IconButton>
                    {itemDetails.offeredInTrade ? (
                        <div className="icon">Offered in Trade</div>
                    ) : (
                        <IconButton
                            aria-label="redeem"
                            onClick={() => handleOpen(itemId)}
                        >
                            <CheckIcon className="icon" />
                        </IconButton>
                    )}
                </CardActions>
            </Card>
        </>
    );
};

export default React.memo(WalletItem);
