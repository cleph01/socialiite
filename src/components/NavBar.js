import { useState } from "react";

import { useHistory } from "react-router-dom";

import "../lib/css/components/demo-nav-bar.scss";

import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import { auth } from "../services/firebase/firebase-config";

function NavBar({ user }) {
    const history = useHistory();

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

    return (
        <div
            className="navbar-container"
            style={{ backgroundColor: "#ffffff" }}
        >
            <div className="logo-wrapper" onClick={() => history.push("/demo")}>
                <img className="logo" src="/logo.png" alt="logo" />
            </div>
            <div className="navbar__body">
                <div
                    className="btn desktop"
                    onClick={() => history.push("/demo/text")}
                >
                    Text Demo
                </div>
                <div
                    className="btn desktop"
                    onClick={() =>
                        handleRedirect(`/demo/business/add/${user.userId}`)
                    }
                >
                    Add Business
                </div>
                <div
                    className="btn desktop"
                    onClick={() =>
                        handleRedirect(`/demo/clients/all/${user.userId}`)
                    }
                >
                    My Clients
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
                    Sign Out
                </div>
            </div>
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
                <MenuItem onClick={() => handleRedirect("/demo/text")}>
                    Text Demo
                </MenuItem>
                <MenuItem
                    onClick={() =>
                        handleRedirect(`/demo/business/add/${user.userId}`)
                    }
                >
                    Add Business
                </MenuItem>
                <MenuItem
                    onClick={() =>
                        handleRedirect(`/demo/clients/all/${user.userId}`)
                    }
                >
                    My Clients
                </MenuItem>
                <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
            </Menu>
        </div>
    );
}

export default NavBar;
