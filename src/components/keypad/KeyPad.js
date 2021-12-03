import React, { useState } from "react";

import { db } from "../../services/firebase/firebase-config";

const keyPadContainer = {
    marginTop: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "300px",
    height: "300px",
    borderRadius: "5px",
};
const flexGrid = {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    height: "33%",
};
const col = {
    width: "100%",
    height: "100%",
    fontSize: "24px",
    backgroundColor: "#213d79",
    color: "#f1f1f1",
};

const pinResultWrapper = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    width: "100%",
    height: "150px",
};

const pinResult = {
    fontWeight: "700",
    fontSize: "36px",
    letterSpacing: "18px",
};
function KeyPad({
    setAlertMsg,
    setOpenSnackBar,
    setCheckinUser,
    setOpenCheckinModal,
}) {
    const [tempPin, setTempPin] = useState("");

    const handleSubmit = () => {
        db.collection("users")
            .where("pin", "==", tempPin)
            .get()
            .then((querySnapshot) => {
                console.log("Query Snapshot in KeyPad: ", querySnapshot);
                if (querySnapshot.docs.length > 0) {
                    setCheckinUser(querySnapshot.docs[0].data());
                    setOpenCheckinModal(true);
                    setTempPin("");
                } else {
                    setAlertMsg({
                        message: `No User Found with PIN: ${tempPin}`,
                        severity: "error",
                    });

                    setOpenSnackBar(true);
                    setTempPin("");
                }
            })
            .catch((error) => {
                setAlertMsg({
                    message: "Error Submitting PIN",
                    severity: "error",
                });

                setOpenSnackBar(true);
            });
    };

    const handleClick = (event) => {
        switch (event.target.innerText) {
            case "Delete":
                if (tempPin.length > 0) {
                    setTempPin((prevState) => {
                        return prevState.slice(0, -1);
                    });
                }
                break;
            case "Submit":
                if (tempPin.length === 6) {
                    console.log("Submit");

                    handleSubmit();
                } else {
                    setAlertMsg({
                        message: "PIN is Missing a Digit.",
                        severity: "error",
                    });

                    setOpenSnackBar(true);
                }

                break;
            default:
                if (tempPin.length <= 5) {
                    setTempPin(
                        (prevState) => prevState + event.target.innerText
                    );
                }
        }
    };

    console.log("Pin: ", tempPin);
    return (
        <div className="keyPadContainer" style={keyPadContainer}>
            <div className="pinResult__wrapper" style={pinResultWrapper}>
                <div className="pinResult" style={pinResult}>
                    {tempPin}
                </div>
            </div>
            <div className="flex-grid" style={flexGrid}>
                <button className="col" style={col} onClick={handleClick}>
                    1
                </button>
                <button className="col" style={col} onClick={handleClick}>
                    2
                </button>
                <button className="col" style={col} onClick={handleClick}>
                    3
                </button>
            </div>
            <div className="flex-grid" style={flexGrid}>
                <button className="col" style={col} onClick={handleClick}>
                    4
                </button>
                <button className="col" style={col} onClick={handleClick}>
                    5
                </button>
                <button className="col" style={col} onClick={handleClick}>
                    6
                </button>
            </div>
            <div className="flex-grid" style={flexGrid}>
                <button className="col" style={col} onClick={handleClick}>
                    7
                </button>
                <button className="col" style={col} onClick={handleClick}>
                    8
                </button>
                <button className="col" style={col} onClick={handleClick}>
                    9
                </button>
            </div>
            <div className="flex-grid" style={flexGrid}>
                <button className="col" style={col} onClick={handleClick}>
                    Delete
                </button>
                <button className="col" style={col} onClick={handleClick}>
                    0
                </button>
                <button className="col" style={col} onClick={handleClick}>
                    Submit
                </button>
            </div>
        </div>
    );
}

export default KeyPad;