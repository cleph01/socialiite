import { useState, useContext } from "react";

import { useParams } from "react-router-dom";

import { db, firebase } from "../../../services/firebase/firebase-config";

import { UserContext } from "../../contexts/UserContext";

import Box from "@mui/material/Box";

import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";

import InputAdornment from "@mui/material/InputAdornment";
import ClearIcon from "@mui/icons-material/Clear";

import Divider from "@mui/material/Divider";

import logo from "../../../assets/images/logos/flame-only-logo.png";
import { authorizedbuyersmarketplace } from "googleapis/build/src/apis/authorizedbuyersmarketplace";

const style = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 325,
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

function ReferralModal({
    handleCloseReferralModal,
    openReferralModal,
    setAlertMsg,
    setOpenSnackBar,
}) {
    const [searchUser, setSearchUser] = useState("");
    const [searchUserOptions, setSearchUserOptions] = useState("");
    const [selectedSearchUser, setSelectedSearchUser] = useState(null);

    const { authUser } = useContext(UserContext);

    const handleConfirmReferral = () => {
        if (selectedSearchUser.userId === authUser.uid) {
            setAlertMsg({
                message: "Sorry, Can't Refer Yourself 🧐",
                severity: "error",
            });

            setOpenSnackBar(true);
        }
    };
    const handleReferrerSelect = (user) => {
        setSelectedSearchUser(user);
        setSearchUser(user.email);
    };

    const handleSearchUser = (event) => {
        // Check if Relationship with business exists

        setSearchUser(event.target.value);

        console.log("HandleSearchUser: ", event.target.value);
        db.collection("users")
            .where("searchableKeywords", "array-contains", event.target.value)
            .get()
            .then((querySnapshot) => {
                console.log("User searchable query docs: ", querySnapshot.docs);
                if (querySnapshot.docs.length > 0) {
                    setSearchUserOptions(
                        querySnapshot.docs.map((refDoc) => ({
                            userId: refDoc.id,
                            ...refDoc.data(),
                        }))
                    );
                } else {
                    setSearchUserOptions([]);
                }
            })
            .catch((error) => {
                console.log("Error Getting Searchable User: ", error);
            });
    };

    return (
        <Modal
            open={openReferralModal}
            onClose={handleCloseReferralModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <div>
                    <span style={{ fontSize: "56px" }}>👊</span>
                    <img
                        alt="socialiite"
                        src={logo}
                        style={{ width: "100px", height: "auto" }}
                    />
                    <span style={{ fontSize: "56px" }}>👍</span>
                </div>
                <h3>The Social Media that Pays YOU</h3>

                <h4>
                    Help spread the word about this wonderful business and get
                    paid!
                </h4>
                <h4>Who invited you here?</h4>

                <h4>We need to pay them first</h4>
                <h4>Thank You</h4>
                <TextField
                    sx={{ width: "100%" }}
                    id="handle"
                    label="Who Referred You"
                    value={
                        selectedSearchUser
                            ? selectedSearchUser.email
                            : searchUser
                    }
                    onChange={handleSearchUser}
                    margin="normal"
                    className="input"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <ClearIcon
                                    onClick={() => {
                                        setSearchUser("");
                                        setSearchUserOptions([]);
                                    }}
                                />
                            </InputAdornment>
                        ),
                    }}
                />
                {searchUserOptions.length > 0 ? (
                    <List>
                        <Divider />
                        {searchUserOptions.map((user, index) => (
                            <div
                                key={index}
                                onClick={() => handleReferrerSelect(user)}
                            >
                                <ListItem className="prize-list-item">
                                    <ListItemAvatar>
                                        <Avatar
                                            alt="user avatar"
                                            src={user.avatarUrl}
                                        />
                                    </ListItemAvatar>
                                    <div>
                                        <ListItemText
                                            primary={user.displayName}
                                            secondary={user.email}
                                        />
                                    </div>
                                </ListItem>
                                <Divider />
                            </div>
                        ))}
                    </List>
                ) : null}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center",
                        marginTop: "15px",
                    }}
                >
                    <div
                        style={redeemStyle}
                        onClick={() => handleConfirmReferral}
                    >
                        Confirm Referral
                    </div>
                    <div style={cancelStyle} onClick={handleCloseReferralModal}>
                        Cancel
                    </div>
                </div>
            </Box>
        </Modal>
    );
}

export default ReferralModal;
