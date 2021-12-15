import React from "react";

import QRCode from "react-qr-code";

function QRcodeGen({ businessId }) {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <QRCode
                value={`https://socialiite.web.app/checkin/${businessId}`}
            />
        </div>
    );
}

export default QRcodeGen;
