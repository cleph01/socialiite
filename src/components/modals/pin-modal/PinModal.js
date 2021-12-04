import { useState, useEffect } from "react";

import { db } from "../../../services/firebase/firebase-config";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const style = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 355,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

const cancelStyle = {
    textAlign: "center",
    width: "fit-content",
    fontSize: "small",
    marginLeft: "10px",
    // background-color: #bcc0bc,
    color: "#bb3133",
    border: "1px solid #bb3133",
    borderRadius: "5px",
    padding: "10px",
    cursor: "pointer",
};

function PinModal({ userId, openPinModal, handleClosePinModal }) {
    const [pin, setPin] = useState();
    console.log("userId in pin modal: ", userId);
    useEffect(() => {
        if (userId) {
            db.collection("users")
                .doc(userId)
                .get()
                .then((docRef) => {
                    console.log("docRef in db call: ", docRef);
                    setPin(docRef.data().pin);
                })
                .catch((error) => {
                    console.log("Error Getting Pin: ", error);
                });
        }
    }, []);

    return (
        <Modal
            open={openPinModal}
            onClose={handleClosePinModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <h3>Your PIN</h3>
                <div style={{ fontSize: "36px" }}>🤫</div>
                <h4>Use it to Check In at Shops</h4>
                <h1 style={{ letterSpacing: "20px" }}>{pin}</h1>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center",
                        marginTop: "15px",
                    }}
                >
                    <div style={cancelStyle} onClick={handleClosePinModal}>
                        Cancel
                    </div>
                </div>
            </Box>
        </Modal>
    );
}

export default PinModal;
