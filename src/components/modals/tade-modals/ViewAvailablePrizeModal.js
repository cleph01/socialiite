import { useState } from "react";

import Box from "@mui/material/Box";

import Divider from "@mui/material/Divider";
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

function ViewAvailablePrizeModal({
    prize,
    openAvailablePrizeModal,
    handleCloseViewAvailablePrizeModal,
}) {
    return (
        <Modal
            open={openAvailablePrizeModal}
            onClose={handleCloseViewAvailablePrizeModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <h2>Prize</h2>
                <h3>{prize.itemDescription}</h3>
                <div style={{ fontWeight: "700", margin: "6px 0px 10px" }}>
                    @ {prize.businessName}
                </div>

                <div style={{ fontSize: "36px" }}>{prize.emoji}</div>
                <h3>Point Cost: {prize.pointCost}</h3>
                <Divider sx={{ color: "#000" }} />
                <h3>Wanna Trade?</h3>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center",
                        marginTop: "15px",
                    }}
                >
                    <div style={redeemStyle}>Make Offers</div>
                    <div
                        style={cancelStyle}
                        onClick={handleCloseViewAvailablePrizeModal}
                    >
                        Cancel
                    </div>
                </div>
            </Box>
        </Modal>
    );
}

export default ViewAvailablePrizeModal;
