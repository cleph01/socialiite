import { useState } from "react";

import Box from "@mui/material/Box";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Skeleton from "@mui/material/Skeleton";

import Modal from "@mui/material/Modal";

import { db } from "../../../services/firebase/firebase-config";

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
    setAlertMsg,
    setOpenSnackBar,
    openAcceptTradeModal,
    handleCloseAcceptTradeModal,
    handleAddToWallet,
    trade,
    setNotifications,
}) {
    const [acceptedOffer, setAcceptedOffer] = useState(null);

    console.log("Trade in Accept Modal: ", trade);
    console.log("Selected Offer: ", acceptedOffer);

    const handleAcceptOffer = () => {
        if (!acceptedOffer) {
            setAlertMsg({
                message: "Select an Offer First",
                severity: "error",
            });
            setOpenSnackBar(true);
        } else {
            return;
        }
        const swapInfoArr = [];
    };

    const handleDeclineOffer = () => {
        db.collection("trades")
            .doc(trade.tradeId)
            .delete()
            .then(() => {
                console.log("trade successfully deleted!");

                trade.tradeOffers.forEach((item) => {
                    Object.keys(item.offer).forEach((key) => {
                        console.log("key: ", key, "Offer: ", item.offer[key]);
                        db.collection("wallet")
                            .doc(item.offer[key].walletItemId)
                            .update({
                                offeredInTrade: false,
                            })
                            .then(() => {
                                console.log(
                                    "Successfully Updated OfferedInTrade for Deleted Trade"
                                );
                            })
                            .catch((error) => {
                                console.log(
                                    "Error Updating OfferedInTrade for Deleted Trade",
                                    error
                                );
                            });
                    });
                });

                setNotifications((prevState) =>
                    prevState.filter(
                        (stateTrade) => stateTrade.tradeId !== trade.tradeId
                    )
                );
                setAlertMsg({
                    message: "Trade Successfully Deleted",
                    severity: "success",
                });
                setOpenSnackBar(true);

                handleCloseAcceptTradeModal();
            })
            .catch((error) => {
                console.error("Error removing document: ", error);

                setAlertMsg({
                    message: "Error Deleting Trade",
                    severity: "error",
                });
                setOpenSnackBar(true);

                handleCloseAcceptTradeModal();
            });
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
                    sx={{ maxHeight: "300px", width: "100%", overflow: "auto" }}
                >
                    {trade.tradeOffers.map((item, i) => (
                        <div
                            key={i}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                type="radio"
                                name="offers"
                                onChange={() =>
                                    setAcceptedOffer({ ...item.offer })
                                }
                            />
                            <Accordion
                                sx={{
                                    width: "100%",
                                    marginLeft: "6px",
                                    marginBottom: "6px",
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <h5>{`Offer ${i + 1}`}</h5>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <ol>
                                        {Object.keys(item.offer).map(
                                            (offer, i) => (
                                                <div key={i}>
                                                    <li
                                                        style={{
                                                            margin: "10px 0",
                                                        }}
                                                    >
                                                        {item.offer[i].emoji}{" "}
                                                        {
                                                            item.offer[i]
                                                                .itemDescription
                                                        }
                                                        <br />
                                                        {
                                                            item.offer[i]
                                                                .businessName
                                                        }
                                                    </li>
                                                </div>
                                            )
                                        )}
                                    </ol>
                                </AccordionDetails>
                            </Accordion>
                        </div>
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
