import React, { forwardRef, useState, useEffect, useContext } from "react";

import { UserContext } from "../../contexts/UserContext";

import "../../lib/scss/components/wallet/wallet.scss";

import ClaimModal from "../modals/claim-modal/ClaimModal";
import ShareModal from "../modals/share-modal/ShareModal";
import WalletItem from "./WalletItem";

import UpcomingMessage from "../../components/UpcomingMessage";

import Skeleton from "@mui/material/Skeleton";

import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import { db } from "../../services/firebase/firebase-config";

const Wallet = () => {
    // State to hold post data from Firebase call

    const { authUser } = useContext(UserContext);

    const [wallet, setWallet] = useState();
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
        db.collection("wallet")
            .where("userId", "==", authUser.uid)
            .where("redeemed", "==", false)
            .get()
            .then((items) => {
                console.log("Items in query: ", items);

                setWallet(
                    items.docs.map((doc) => ({
                        walletItemId: doc.id,
                        walletItem: doc.data(),
                    }))
                );
            })
            .catch((error) => {
                console.log("Error Getting Wallet Items: ", error);
            });
    }, []);

    const handleRedeem = () => {
        db.collection("wallet")
            .where("userId", "==", authUser.uid)
            .update({
                redeemed: true,
                redeemedOn: Date.now(),
            })
            .then(() => {
                console.log("Document successfully updated!");

                setWallet((prevState) => {
                    return prevState.filter(
                        (walletItem) => walletItem.walletItemId !== walletItemId
                    );
                });
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

    if (!wallet) {
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
            <div className="wallet-wrapper">
                <h3>Digital Wallet</h3>

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
                    <UpcomingMessage
                        message="Checkin, Promote, and Win!!"
                        emoji="💰"
                    />
                )}
            </div>

            <ClaimModal
                openClaimModal={openClaimModal}
                setOpenClaimModal={setOpenClaimModal}
                handleRedeem={handleRedeem}
            />
            <ShareModal
                shareBusiness={shareBusiness}
                openShareModal={openShareModal}
                setOpenShareModal={setOpenShareModal}
                handleCloseShareModal={handleCloseShareModal}
            />
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
