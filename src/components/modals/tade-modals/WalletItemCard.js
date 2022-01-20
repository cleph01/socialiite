import { useState, useEffect } from "react";

function WalletItemCard({ walletIndex, walletHashArr }) {
    return (
        <div
            style={{
                width: "200px",
                height: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #e1e1e1",
                padding: "25px 10px 10px",
                borderRadius: "10px",
                lineHeight: "28px",
                boxShadow:
                    "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
            }}
        >
            <div
                style={{
                    textAlign: "center",
                    fontSize: "54px",
                }}
            >
                {walletHashArr[walletIndex]?.emoji}
            </div>
            <div
                style={{
                    marginTop: "26px",
                    fontSize: "26px",
                    fontWeight: 700,
                }}
            >
                {walletHashArr[walletIndex]?.description}
            </div>
            <div style={{ fontWeight: 700 }}>
                from {walletHashArr[walletIndex]?.businessName}
            </div>
            <div style={{ fontSize: "20px", fontWeight: 700 }}>
                {walletHashArr[walletIndex]?.pointCost > 1 ||
                walletHashArr[walletIndex]?.pointCost == 0
                    ? `${walletHashArr[walletIndex]?.pointCost} Points`
                    : `${walletHashArr[walletIndex]?.pointCost} Point`}
            </div>

            <div style={{ fontSize: "20px", fontWeight: 700 }}>
                {" "}
                Qty: {walletHashArr[walletIndex]?.walletIds.length}
            </div>
        </div>
    );
}

export default WalletItemCard;
