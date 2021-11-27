import React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";

import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import AddIcon from "@mui/icons-material/Add";

import "../../lib/scss/components/checkin/available-prize-list-item.scss";

function AvailablePrizeItem({
    prize,
    handleOpenClaimModal,
    checkedIn,
    dupCheckIn,
}) {
    return (
        <ListItem className="prize-list-item">
            <ListItemAvatar>
                <span className="emoji">{prize.prize.emoji}</span>
            </ListItemAvatar>
            <div>
                <ListItemText
                    primary={prize.prize.description}
                    secondary={`Points Needed: ${prize.prize.pointCost}`}
                />
            </div>
            {checkedIn && !dupCheckIn ? (
                <ListItemSecondaryAction className="list-icons-wrapper">
                    <AddIcon
                        className="list-icons"
                        id={prize.prizeId}
                        onClick={() =>
                            handleOpenClaimModal({
                                prizeId: prize.prizeId,
                                ...prize.prize,
                            })
                        }
                    />
                </ListItemSecondaryAction>
            ) : (
                <ListItemSecondaryAction className="list-icons-wrapper">
                    <div className="checkin-pending-text">Checkin to Claim</div>
                </ListItemSecondaryAction>
            )}
        </ListItem>
    );
}

export default AvailablePrizeItem;
