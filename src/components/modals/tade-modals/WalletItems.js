import { useState } from "react";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

function WalletItems({ wallet }) {
    const [walletIndex, setWalletIndex] = useState(0);

    const traverseForward = () => {
        if (walletIndex === wallet.length - 1) {
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

    console.log("Wallet Index: ", walletIndex);
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
                <div
                    style={{
                        width: "200px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <div
                        style={{
                            textAlign: "center",
                            fontSize: "36px",
                        }}
                    >
                        {wallet[walletIndex].emoji}
                    </div>
                    <div>{wallet[walletIndex].itemDescription}</div>
                    <div>from {wallet[walletIndex].businessName}</div>
                    <div>{wallet[walletIndex].pointCost}</div>
                    <div>{walletIndex}</div>
                </div>
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
                <div>
                    <RemoveCircleOutlineIcon />
                </div>
                <div style={{ margin: "0px 10px" }}>Add to Offer</div>
                <div>
                    <AddCircleOutlineIcon />
                </div>
            </div>
        </div>
    );
}

export default WalletItems;
