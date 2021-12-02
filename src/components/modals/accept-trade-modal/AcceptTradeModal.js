import { useState } from "react";

import Box from "@mui/material/Box";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";

import Skeleton from "@mui/material/Skeleton";

import Modal from "@mui/material/Modal";

const style = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 355,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

const acceptStyle = {
    textAlign: "center",
    width: "fit-content",
    fontSize: "small",
    marginLeft: "10px",
    // background-color: #bcc0bc,
    color: "#68cb61",
    border: "1px solid #68cb61",
    borderRadius: "5px",
    padding: "10px",
    cursor: "pointer",
};

const declineStyle = {
    textAlign: "center",
    width: "fit-content",
    fontSize: "small",
    marginLeft: "10px",
    // background-color: #bcc0bc,
    color: "#213b77",
    border: "1px solid #213b77",
    borderRadius: "5px",
    padding: "10px",
    cursor: "pointer",
};

const cancelStyle = {
    textAlign: "center",
    width: "fit-content",
    fontSize: "small",
    marginLeft: "10px",
    // background-color: #bcc0bc,
    color: "#bb3133",
    border: "1px solid #bb3133",
    borderRadius: "5px",
    padding: "10px",
    cursor: "pointer",
};

function AcceptTradeModal({
    openAcceptTradeModal,
    handleCloseAcceptTradeModal,
    handleAddToWallet,
    trade,
}) {
    console.log("Trade in Accept Modal: ", trade);

    const handleAcceptOffer = () => {
        const swapInfoArr = [];

        // swapInfoArr.push({from})
        return;
    };

    const handleDeclineOffer = () => {
        return;
    };

    if (!trade) {
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
        <Modal
            open={openAcceptTradeModal}
            onClose={handleCloseAcceptTradeModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <h3>Accept the Trade?</h3>
                <h4>They Want Your:</h4>
                <div style={{ fontSize: "36px" }}>{trade.emoji}</div>
                <h4>{trade.description}</h4>
                <h4>Original Cost: {trade.pointCost} points</h4>
                <h5>They Offer:</h5>
                <List
                    className="product-list-container"
                    sx={{ maxHeight: "300px", overflow: "auto" }}
                >
                    {trade.tradeOffers.map((item, i) => (
                        <span key={i}>
                            <ListItem className="product-list-item">
                                <ListItemAvatar>
                                    <Avatar
                                        sx={{ width: 46, height: 46 }}
                                        loading="lazy"
                                    >
                                        <span style={{ fontSize: "36px" }}>
                                            {item.emoji}
                                        </span>
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={item.itemDescription}
                                    secondary={`${item.businessName} | ${item.pointCost} points`}
                                />
                            </ListItem>
                            <Divider />
                        </span>
                    ))}
                </List>
                <h4>Cannot Be Reversed</h4>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center",
                        marginTop: "15px",
                    }}
                >
                    <div style={acceptStyle} onClick={handleAcceptOffer}>
                        Accept Trade
                    </div>
                    <div style={declineStyle} onClick={handleDeclineOffer}>
                        Decline
                    </div>
                    <div
                        style={cancelStyle}
                        onClick={handleCloseAcceptTradeModal}
                    >
                        Close
                    </div>
                </div>
            </Box>
        </Modal>
    );
}

export default AcceptTradeModal;
