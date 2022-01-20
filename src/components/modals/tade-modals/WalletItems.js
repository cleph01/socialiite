import { useState, useEffect } from "react";

import WalletItemCard from "./WalletItemCard";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

import Skeleton from "@mui/material/Skeleton";

function WalletItems({
    wallet,
    setWallet,
    walletIndex,
    setWalletIndex,
    setOffers,
}) {
    // const [walletIndex, setWalletIndex] = useState(0);

    const [walletHashArr, setWalletHashArr] = useState({});

    const traverseForward = () => {
        if (walletIndex === walletHashArr.length - 1) {
            setWalletIndex(0);
        } else {
            setWalletIndex(walletIndex + 1);
        }
    };

    const traverseBackward = () => {
        if (walletIndex === 0) {
            setWalletIndex(wallet.length - 1);
        } else {
            setWalletIndex(walletIndex - 1);
        }
    };

    const handleAddToOffer = () => {
        setOffers((prevState) => {
            let walletItem = null;
            let walletIdRef = walletHashArr[walletIndex].walletIds;
            let offerWalletId = walletIdRef[walletIdRef.length - 1];

            for (const item of wallet) {
                if (item.walletItemId === offerWalletId) {
                    walletItem = item;
                }
            }

            return [...prevState, walletItem];
        });

        setWallet((prevState) => {
            let walletIdRef = walletHashArr[walletIndex].walletIds;
            let offerWalletId = walletIdRef[walletIdRef.length - 1];

            return prevState.filter(
                (element) => element.walletItemId !== offerWalletId
            );
        });
    };

    useEffect(() => {
        if (wallet.length > 0) {
            let hashMap = {};

            wallet.forEach((item) => {
                if (hashMap.hasOwnProperty(item.prizeId)) {
                    hashMap[item.prizeId].quantity =
                        hashMap[item.prizeId].quantity + 1;
                    hashMap[item.prizeId].walletIds.push(item.walletItemId);
                } else {
                    hashMap[item.prizeId] = { quantity: 1 };
                    hashMap[item.prizeId] = {
                        ...hashMap[item.prizeId],
                        walletIds: [item.walletItemId],
                        emoji: item.emoji,
                        businessName: item.businessName,
                        description: item.itemDescription,
                        pointCost: item.pointCost,
                    };
                }
            });

            setWalletHashArr(
                Object.keys(hashMap).map((item) => ({
                    prizeId: item,
                    ...hashMap[item],
                }))
            );
        }
    }, [wallet]);

    console.log("Wallet Index: ", walletIndex);
    console.log("Wallet in wallet items: ", wallet);
    console.log("Wallet Hash arr wallet items: ", walletHashArr);

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
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <div onClick={traverseBackward}>
                    <ArrowBackIosNewIcon />
                </div>
                <WalletItemCard
                    walletHashArr={walletHashArr}
                    walletIndex={walletIndex}
                />

                <div onClick={traverseForward}>
                    <ArrowForwardIosIcon />
                </div>
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "20px 0px",
                }}
            >
                <div style={{ margin: "0px 10px" }}>Add to Offer</div>
                <div onClick={() => handleAddToOffer()}>
                    <AddCircleOutlineIcon />
                </div>
            </div>
        </div>
    );
}

export default WalletItems;
