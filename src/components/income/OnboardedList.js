import { useState } from "react";

import { Link } from "react-router-dom";

import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";

import "../../lib/scss/components/income/onboarded-list.scss";

function OnboardedList({ onboardedBusinesses }) {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <div className="onboarded-list-container">
            <div className="section" onClick={handleClick}>
                {open
                    ? "Hide Onboarded Businesses"
                    : "Show Onboarded Businesses"}
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
                    {onboardedBusinesses.map((business, i) => (
                        <Link
                            key={i}
                            to={`/shops/${business.businessId}`}
                            style={{ textDecoration: "none", color: "inherit" }}
                        >
                            <Divider />
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar src={business.logoUrl} />
                                </ListItemAvatar>
                                <div className="bla">
                                    <Typography type="headline" component="h2">
                                        {business.businessName}
                                    </Typography>
                                </div>
                                <ListItemSecondaryAction
                                    sx={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        width: "60px",
                                    }}
                                >
                                    <div
                                        style={{ fontSize: "24px" }}
                                        onClick={() => {
                                            alert("Clicked");
                                        }}
                                    >
                                        👀
                                    </div>
                                </ListItemSecondaryAction>
                            </ListItem>
                            <Divider />
                        </Link>
                    ))}
                </List>
            </Collapse>
        </div>
    );
}

export default OnboardedList;
