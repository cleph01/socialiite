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

function ClaimModal({ openClaimModal, handleAddToWallet, handleRedeem, handleCloseClaimModal }) {
    return (
        <Modal
            open={openClaimModal}
            onClose={handleCloseClaimModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography
                    id="modal-modal-title"
                    variant="h6"
                    sx={{ textAlign: "center", borderColor: "#f0f0f0" }}
                >
                    Please Show to Attendant
                </Typography>
                <Typography
                    id="modal-modal-description"
                    sx={{ mt: 2, textAlign: "center" }}
                >
                    Sure About Claiming Prize?
                </Typography>

                <h3>Cannot Be Reversed</h3>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center",
                        marginTop: "15px",
                    }}
                >
                    <div style={redeemStyle} onClick={handleRedeem}>
                        Claim Prize
                    </div>
                    <div style={cancelStyle} onClick={handleCloseClaimModal}>
                        Cancel
                    </div>
                </div>
            </Box>
        </Modal>
    );
}

export default ClaimModal;
