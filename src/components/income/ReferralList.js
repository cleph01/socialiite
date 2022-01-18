import { useState } from "react";

import ReferralListUser from "./ReferralListUser";

import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import List from "@mui/material/List";

import "../../lib/scss/components/income/onboarded-list.scss";

function ReferralList({ referralList }) {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(!open);
    };

    console.log("Referral List: ", referralList);
    return (
        <div className="onboarded-list-container">
            <div className="section" onClick={handleClick}>
                {open ? "Hide Referrals" : "Show Referrals"}
                {open ? <ExpandLess /> : <ExpandMore />}
            </div>
            <Collapse
                in={open}
                timeout="auto"
                unmountOnExit
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "99%",
                }}
            >
                <List>
                    {referralList.map((referral, i) => (
                        <ReferralListUser key={i} referral={referral} />
                    ))}
                </List>
            </Collapse>
        </div>
    );
}

export default ReferralList;
