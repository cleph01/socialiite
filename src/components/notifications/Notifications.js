import { useState, useEffect, useContext, forwardRef } from "react";
import { UserContext } from "../../contexts/UserContext";

import AcceptTradeModal from "../modals/accept-trade-modal/AcceptTradeModal";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";

import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import Skeleton from "@mui/material/Skeleton";
import UpcomingMessage from "../UpcomingMessage";

import { db } from "../../services/firebase/firebase-config";

import "../../lib/scss/components/trade-room/available-prizes.scss";
function Notifications({ userId }) {
    const [notifications, setNotifications] = useState();
    const { authUser } = useContext(UserContext);

    const [trade, setTrade] = useState();

    const [openAcceptTradeModal, setOpenAcceptTradeModal] = useState(false);
    const handleCloseAcceptTradeModal = () => setOpenAcceptTradeModal(false);

    const [alertMsg, setAlertMsg] = useState({
        message: "",
        severity: "success",
    });

    const [openSnackBar, setOpenSnackBar] = useState(false);

    const handleCloseSnackBar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpenSnackBar(false);
    };

    const Alert = forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    useEffect(() => {
        db.collection("trades")
            .where("ownerId", "==", authUser.uid)
            .where("settled", "==", false)
            .get()
            .then((querySnapshot) => {
                console.log("querySnapshot: ", querySnapshot);
                setNotifications(
                    querySnapshot.docs.map((doc) => ({
                        tradeId: doc.id,
                        ...doc.data(),
                    }))
                );
            })
            .catch((error) => {
                console.log(
                    "Error Getting Trades in Notifcation Route: ",
                    error
                );
            });
    }, []);

    console.log("Notifications State: ", notifications);

    if (!notifications) {
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

    if (notifications.length === 0) {
        return (
            <div
                style={{
                    width: "90vmin",
                    padding: "10px",
                    borderRadius: "5px",
                    marginBottom: "6px",
                    backgroundColor: "#fff",
                    opacity: 0.85,
                }}
            >
                <h3>Offers to Trade</h3>
                <UpcomingMessage message="Your All Caught Up" emoji="💯" />
            </div>
        );
    }

    return (
        <>
            <div className="available-prizes__wrapper">
                <h3>Offers to Trade</h3>
                <List
                    className="product-list-container"
                    sx={{ maxHeight: "300px", overflow: "auto" }}
                >
                    {notifications.map((item, i) => (
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
                                    secondary={`${item.businessName} | ${item.tradeOffers.length} offers`}
                                />
                                <ListItemSecondaryAction
                                    sx={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        width: "60px",
                                    }}
                                >
                                    <div
                                        style={{ fontSize: "24px" }}
                                        onClick={() => {
                                            setOpenAcceptTradeModal(true);
                                            setTrade({ ...item });
                                        }}
                                    >
                                        👀
                                    </div>
                                </ListItemSecondaryAction>
                            </ListItem>
                            <Divider />
                        </span>
                    ))}
                </List>
            </div>
            <AcceptTradeModal
                trade={trade}
                openAcceptTradeModal={openAcceptTradeModal}
                handleCloseAcceptTradeModal={handleCloseAcceptTradeModal}
            />
            <Stack spacing={2} sx={{ width: "100%" }}>
                <Snackbar
                    open={openSnackBar}
                    autoHideDuration={3000}
                    onClose={handleCloseSnackBar}
                >
                    <Alert
                        onClose={handleCloseSnackBar}
                        severity={alertMsg.severity}
                        sx={{ width: "100%" }}
                    >
                        {alertMsg.message}
                    </Alert>
                </Snackbar>
            </Stack>
        </>
    );
}

export default Notifications;
