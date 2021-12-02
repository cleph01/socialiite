import { useState } from "react";

import Box from "@mui/material/Box";

import Typography from "@mui/material/Typography";
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

const redeemStyle = {
    textAlign: "center",
    width: "fit-content",
    fontSize: "small",
    marginLeft: "10px",
    // background-color: #bcc0bc,
    color: "#213b77",
    border: "1px solid #213b77",
    borderRadius: "5px",
    padding: "10px",
    cursor: "pointer",
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

function AcceptTradeModal({
    openAcceptTradeModal,
    handleCloseAcceptTradeModal,
    handleAddToWallet,
    handleCloseClaimModal,
}) {
    return (
        <Modal
            open={openAcceptTradeModal}
            onClose={handleCloseAcceptTradeModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <h3>Sure About Claiming Prize?</h3>

                <h4>Cannot Be Reversed</h4>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center",
                        marginTop: "15px",
                    }}
                >
                    <div style={redeemStyle} onClick={handleAddToWallet}>
                        Accept Trade
                    </div>
                    <div
                        style={cancelStyle}
                        onClick={handleCloseAcceptTradeModal}
                    >
                        Decline
                    </div>
                </div>
            </Box>
        </Modal>
    );
}

export default AcceptTradeModal;
