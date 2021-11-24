import React, { forwardRef, useState, useEffect, useContext } from "react";

import { UserContext } from "../../contexts/UserContext";

import "../../lib/scss/components/wallet/wallet.scss";

import ClaimModal from "../modals/claim-modal/ClaimModal";
import ShareModal from "../modals/share-modal/ShareModal";
import WalletItem from "./WalletItem";

import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import { db } from "../../services/firebase/firebase-config";

const Wallet = (props) => {
    // State to hold post data from Firebase call

    const { userState } = useContext(UserContext);

    const [wallet, setWallet] = useState([]);
    const [walletItemId, setWalletItemId] = useState();

    // businessId for share modal
    const [shareBusiness, setShareBusiness] = useState();

    const [openClaimModal, setOpenClaimModal] = useState(false);
    // State to control Share Modal
    const [openShareModal, setOpenShareModal] = useState(false);
    const [openSnackBar, setOpenSnackBar] = useState(false);

    const handleOpen = (itemId) => {
        setOpenClaimModal(true);
        setWalletItemId(itemId);

        console.log("itemId: ", itemId);
    };

    const handleCloseShareModal = () => setOpenShareModal(false);
    const handleCloseClaimModal = () => setOpenClaimModal(false);

    //every time a new post is added this code fires
    useEffect(() => {
        db.collection(`user/${userState.userId}/wallet`)
            .where("redeemed", "==", false)
            .onSnapshot((snapshot) => {
                setWallet(
                    snapshot.docs.map((doc) => ({
                        walletItemId: doc.id,
                        walletItem: doc.data(),
                    }))
                );
            });
    }, []);

    const handleRedeem = () => {
        db.collection("user")
            .doc(userState.userId)
            .collection("wallet")
            .doc(walletItemId)
            .update({
                redeemed: true,
                redeemedOn: Date.now(),
            })
            .then(() => {
                console.log("Document successfully updated!");
                setOpenClaimModal(false);
                setOpenSnackBar(true);
            })
            .catch((error) => {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
    };

    const Alert = forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const handleCloseSnackBar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpenSnackBar(false);
    };

    console.log("Wallet: ", wallet);

    return (
        <>
            <div className="container">
                <div className="wallet-wrapper">
                    <div className="header">
                        <div className="emoji">&#x1F4B0;</div>
                    </div>
                    {wallet.length > 0 ? (
                        wallet.map((item, index) => (
                            <WalletItem
                                key={index}
                                itemId={item.walletItemId}
                                itemDetails={item.walletItem}
                                handleOpen={handleOpen}
                                handleCloseClaimModal={handleCloseClaimModal}
                                setShareBusiness={setShareBusiness}
                                setOpenShareModal={setOpenShareModal}
                            />
                        ))
                    ) : (
                        <div>Empty Wallet</div>
                    )}
                </div>
            </div>
            <ClaimModal />
            <ShareModal />
            <Stack spacing={2} sx={{ width: "100%" }}>
                <Snackbar
                    open={openSnackBar}
                    autoHideDuration={3000}
                    onClose={handleCloseSnackBar}
                >
                    <Alert
                        onClose={handleCloseSnackBar}
                        severity="success"
                        sx={{ width: "100%" }}
                    >
                        Congratulations! Enjoy Your Prize.
                    </Alert>
                </Snackbar>
            </Stack>
        </>
    );
};

export default Wallet;
