import React from "react";
import { Link } from "react-router-dom";
import List from "@mui/material/List";

import AvailablePrizeItem from "./AvailablePrizeItem";

import Divider from "@mui/material/Divider";

import "../../lib/scss/components/checkin/available-prize-list.scss";

function AvailablePrizes({
    prizes,
    handleOpenClaimModal,
    storeId,
    handleOpenShareModal,
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
                        storeId={storeId}
                    />
                    <Divider />
                </div>
            ))}
        </List>
    );
}

export default AvailablePrizes;
