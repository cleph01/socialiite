import { useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";
import Box from "@mui/material/Box";

import Modal from "@mui/material/Modal";

import { db, firebase } from "../../../services/firebase/firebase-config";

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

function DeleteShopModal({
    openDeleteModal,
    setOpenDeleteModal,
    setAlertMsg,
    setOpenSnackBar,
    deleteBusiness,
    setShops,
}) {
    const handleCloseClaimModal = () => {
        setOpenDeleteModal(false);
    };

    const handleDelete = () => {
        db.collection("shops")
            .doc(deleteBusiness.businessId)
            .delete()
            .then(() => {
                console.log("Shop Successfully Deleted!");

                setAlertMsg({
                    message: "Shop Successfully Deleted",
                    severity: "success",
                });

                setOpenSnackBar(true);

                setShops((prevState) =>
                    prevState.filter(
                        (shop) => shop.businessId !== deleteBusiness.businessId
                    )
                );

                handleCloseClaimModal();
            })
            .catch((error) => {
                // The document probably doesn't exist.
                console.error("Error deleting business: ", error);

                setAlertMsg({
                    message: "Error deleting business",
                    severity: "error",
                });

                setOpenSnackBar(true);

                handleCloseClaimModal();
            });
    };

    return (
        <Modal
            open={openDeleteModal}
            onClose={handleCloseClaimModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <h3>Sure About Deleting this Shop?</h3>
                <h2>{deleteBusiness?.businessName}</h2>
                <h4>Cannot Be Reversed</h4>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center",
                        marginTop: "15px",
                    }}
                >
                    <div style={redeemStyle} onClick={handleDelete}>
                        Delete
                    </div>
                    <div style={cancelStyle} onClick={handleCloseClaimModal}>
                        Cancel
                    </div>
                </div>
            </Box>
        </Modal>
    );
}

export default DeleteShopModal;
