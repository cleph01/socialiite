import React from "react";

import { useState, useContext } from "react";

import { useHistory } from "react-router-dom";

import logo from "../assets/images/logos/logo.png";

import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import { UserContext } from "../contexts/UserContext";

import { auth } from "../services/firebase/firebase-config";

import "../lib/scss/components/nav-bar/nav-bar.scss";

function NavBar() {
    const history = useHistory();

    const { userState, authUser } = useContext(UserContext);

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleRedirect = (path) => {
        history.push(path);
        setAnchorEl(null);
    };

    const handleSignOut = () => {
        auth.signOut();

        history.push("/login");
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    console.log("AuthUser at NavBar: ", userState);
    return (
        <div className="navbar-container">
            <div className="logo-wrapper" onClick={() => history.push("/demo")}>
                <img className="logo" src={logo} alt="logo" />
            </div>

            {authUser && (
                <div className="navbar__body">
                    <div
                        className="btn desktop"
                        onClick={() => handleRedirect("/hero")}
                    >
                        🏠 Home
                    </div>
                    <div
                        className="btn desktop"
                        onClick={() => handleRedirect(`/trade`)}
                    >
                        🤝 Trade Room
                    </div>
                    <div
                        className="btn desktop"
                        onClick={() => handleRedirect(`/hero/shoutouts`)}
                    >
                        📣 Shoutouts
                    </div>
                    <div
                        className="btn desktop"
                        onClick={() => handleRedirect(`/hero/partner-shops`)}
                    >
                        🤜🤛 Partner Shops
                    </div>
                    <div
                        className="btn desktop"
                        onClick={() => handleRedirect(`/hero/wallet`)}
                    >
                        💰 Wallet
                    </div>
                    <div
                        className="btn desktop"
                        onClick={() => handleRedirect(`/hero/notifications`)}
                    >
                        🔔 Trade Offers
                    </div>
                    <div
                        className="btn desktop"
                        onClick={() => handleRedirect(`/search/shops`)}
                    >
                        🔍 Search Shops
                    </div>

                    <div
                        className="btn signout desktop"
                        onClick={handleSignOut}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                handleSignOut();
                            }
                        }}
                    >
                        ✌️ Sign Out
                    </div>
                </div>
            )}
            {authUser && (
                <>
                    <div className="menu" onClick={handleClick}>
                        <MenuIcon sx={{ fontSize: "2rem" }} />
                    </div>

                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            "aria-labelledby": "basic-button",
                        }}
                    >
                        <MenuItem onClick={() => handleRedirect("/hero")}>
                            🏠 Home
                        </MenuItem>
                        <MenuItem onClick={() => handleRedirect(`/trade`)}>
                            🤝 Trade Room
                        </MenuItem>
                        <MenuItem
                            onClick={() => handleRedirect(`/hero/shoutouts`)}
                        >
                            📣 Shoutouts
                        </MenuItem>
                        <MenuItem
                            onClick={() =>
                                handleRedirect(`/hero/partner-shops`)
                            }
                        >
                            🤜🤛 Partner Shops
                        </MenuItem>
                        <MenuItem
                            onClick={() => handleRedirect(`/hero/wallet`)}
                        >
                            💵 Wallet
                        </MenuItem>
                        <MenuItem
                            onClick={() =>
                                handleRedirect(`/hero/notifications`)
                            }
                        >
                            🔔 Offers to Trade
                        </MenuItem>

                        <MenuItem
                            onClick={() => handleRedirect(`/search/shops`)}
                        >
                            🔍 Search Shops
                        </MenuItem>
                        <MenuItem onClick={handleSignOut}>✌️ Sign Out</MenuItem>
                    </Menu>
                </>
            )}
        </div>
    );
}

export default React.memo(NavBar);
