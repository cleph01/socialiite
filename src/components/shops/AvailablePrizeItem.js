import React, { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";

import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import AddIcon from "@mui/icons-material/Add";

import "../../lib/scss/components/shops/available-prize-list-item.scss";

function AvailablePrizeItem({
    prize,
    handleOpenClaimModal,
}) {
    const { authUser } = useContext(UserContext);

    return (
        <ListItem className="prize-list-item">
            <ListItemAvatar>
                <span className="emoji">{prize.prize.emoji}</span>
            </ListItemAvatar>
            <div>
                <ListItemText
                    primary={prize.prize.description}
                    secondary={
                        prize.prize.incentive
                            ? "Free for New Socialiites"
                            : `Points Needed: ${prize.prize.pointCost}`
                    }
                />
            </div>

            <ListItemSecondaryAction className="list-icons-wrapper">
                {authUser ? (
                    <div
                        className="claim-prize-emoji"
                        onClick={() => handleOpenClaimModal(prize)}
                    >
                        🙌
                    </div>
                ) : (
                    <div className="checkin-pending-text">Login to Claim</div>
                )}
            </ListItemSecondaryAction>
        </ListItem>
    );
}

export default AvailablePrizeItem;
