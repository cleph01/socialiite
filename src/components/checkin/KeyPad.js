import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";

import { db, firebase } from "../../services/firebase/firebase-config";

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
    backgroundColor: "#e1e1e1",
    width: "100%",
    height: "150px",
};

const pinResult = {
    fontWeight: "700",
    fontSize: "36px",
    letterSpacing: "18px",
};
function KeyPad({ setAlertMsg, handleCheckin, setOpenSnackBar }) {
    const [tempPin, setTempPin] = useState("");
    const { businessId } = useParams();
    const { authUser } = useContext(UserContext);

    const handleValidatePin = () => {
        db.collection("shops")
            .doc(businessId)
            .get()
            .then((doc) => {
                console.log(
                    "Validate Doc: ",
                    doc.data(),
                    " - TempPin: ",
                    tempPin
                );
                if (doc.data().checkinPin !== parseInt(tempPin)) {
                    setAlertMsg({
                        message: "Incorrect PIN. Try Again.",
                        severity: "error",
                    });
                    setOpenSnackBar(true);
                    setTempPin("");
                } else {
                    handleCheckin();
                    setTempPin("");
                }
            })
            .catch((error) => {
                console.log("Error Submitting PIN: ", error);
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
                if (tempPin.length <= 4) {
                    console.log("Submit");

                    handleValidatePin();
                } else {
                    setOpenSnackBar(true);

                    setAlertMsg({
                        message: "PIN is Missing a Digit.",
                        severity: "error",
                    });

                    setOpenSnackBar(true);
                }

                break;
            default:
                if (tempPin.length < 4) {
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
