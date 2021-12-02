import { useContext, useState, useEffect, forwardRef } from "react";
import { UserContext } from "../contexts/UserContext";
import { db } from "../services/firebase/firebase-config";

import OpenTrades from "../components/trade/OpenTrades";
import AvailablePrizes from "../components/trade/AvailablePrizes";
import ViewOpenTradeModal from "../components/modals/tade-modals/ViewOpenTradeModal";
import ViewAvailablePrizeModal from "../components/modals/tade-modals/ViewAvailablePrizeModal";
import MakeOffer from "../components/modals/tade-modals/MakeOffer";

import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import NavBar from "../components/NavBar";

import "../lib/scss/pages/trade-room.scss";

import logo from "../assets/images/logos/logo_white_text.png";

function Trade() {
    const { authUser } = useContext(UserContext);

    const [prize, setPrize] = useState({
        emoji: "🍣",
        description: "All You Can Eat Sushi",
        priceCost: "4",
        businessId: "abcd",
        businessName: "Haiku",
    });

    const [trade, setTrade] = useState();

    const [openTrades, setOpenTrades] = useState();

    const [openViewTradeModal, setOpenViewTradeModal] = useState(false);
    const [openAvailablePrizeModal, setOpenAvailablePrizeModal] =
        useState(false);
    const [openMakeOfferModal, setOpenMakeOfferModal] = useState(false);

    const [openSnackBar, setOpenSnackBar] = useState(false);

    const [alertMsg, setAlertMsg] = useState({
        message: "",
        severity: "",
    });

    const handleCloseViewTradeModal = () => setOpenViewTradeModal(false);
    const handleCloseViewAvailablePrizeModal = () =>
        setOpenAvailablePrizeModal(false);
    const handleCloseMakeOfferModal = () => setOpenMakeOfferModal(false);

    const Alert = forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const handleCloseSnackBar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpenSnackBar(false);
    };

    console.log("Open Trades: ", openTrades);

    return (
        <div
            className="trade-room__container"
            style={{
                backgroundImage: 'url("/logo192.png")',
                marginBottom: "125px",
            }}
        >
            <NavBar />

            <h3 className="trade-room__header">Trade Room</h3>
            <OpenTrades setTrade={setTrade} />

            <AvailablePrizes
                setPrize={setPrize}
                setOpenAvailablePrizeModal={setOpenAvailablePrizeModal}
                setOpenMakeOfferModal={setOpenMakeOfferModal}
            />

            <ViewOpenTradeModal
                trade={trade}
                openViewTradeModal={openViewTradeModal}
                handleCloseViewTradeModal={handleCloseViewTradeModal}
            />
            <ViewAvailablePrizeModal
                prize={prize}
                openAvailablePrizeModal={openAvailablePrizeModal}
                handleCloseViewAvailablePrizeModal={
                    handleCloseViewAvailablePrizeModal
                }
            />
            <MakeOffer
                prize={prize}
                openMakeOfferModal={openMakeOfferModal}
                handleCloseMakeOfferModal={handleCloseMakeOfferModal}
                setAlertMsg={setAlertMsg}
                setOpenSnackBar={setOpenSnackBar}
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
        </div>
    );
}

export default Trade;
