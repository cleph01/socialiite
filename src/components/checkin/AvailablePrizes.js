import React from "react";
import { Link } from "react-router-dom";
import List from "@mui/material/List";

import AvailablePrizeItem from "./AvailablePrizeItem";

import Divider from "@mui/material/Divider";

import "../../lib/scss/components/checkin/available-prize-list.scss";

function AvailablePrizes({
    prizes,
    handleOpenClaimModal,
    businessId,
    handleOpenShareModal,
    checkedIn,
    dupCheckIn,
}) {
    if (!prizes) {
        return <div>...Loading Available Prizes</div>;
    }

    return (
        <List className="prize-list-container">
            {prizes.map((prize, i) => (
                <div key={i}>
                    <AvailablePrizeItem
                        prize={prize}
                        handleOpenClaimModal={handleOpenClaimModal}
                        handleOpenShareModal={handleOpenShareModal}
                        businessId={businessId}
                        checkedIn={checkedIn}
                        dupCheckIn={dupCheckIn}
                    />
                    <Divider />
                </div>
            ))}
        </List>
    );
}

export default AvailablePrizes;
