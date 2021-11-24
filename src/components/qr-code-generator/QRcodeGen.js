import React from "react";

import QRCode from "react-qr-code";

import "./styles/qr-code.scss";

function QRcodeGen({ todaysDate }) {
    // const todaysDate = new Date(props.date);

    console.log("Today's date: ", todaysDate);
    return (
        <div className="qr-code-container">
            <QRCode value={`https://google.com?k=${todaysDate}`} />
        </div>
    );
}

export default QRcodeGen;
