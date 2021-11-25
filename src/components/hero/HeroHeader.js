import { Link, useHistory } from "react-router-dom";

import Avatar from "@mui/material/Avatar";
import Socials from "./Socials";
import MenuButton from "../MenuButton";

import "../../lib/scss/components/hero/hero-header.scss";

import { auth } from "../../services/firebase/firebase-config";

const emojiStyle = {
    display: "inline-block",
    fontSize: "24px",
};

function HeroHeader({ user }) {
    let history = useHistory();

    const handleSignOut = () => {
        console.log("clicking signout");
        auth.signOut();

        history.push("/login");
    };

    return (
        <>
            {/* Main Grid */}
            <div className="hero-header__grid">
                <div className="col col-left">
                    <Avatar
                        src={user.avatarUrl}
                        alt={user.displayName}
                        sx={{ width: 56, height: 56 }}
                    />
                    <div className="hero__details">
                        <div className="hero__detail">{user.displayName}</div>
                        <div className="hero__detail">
                            Referred: 356 Sociallites
                        </div>
                        <div className="hero__detail">
                            Followers: 693 | Following: 936
                        </div>
                    </div>
                </div>
                <div className="col">
                    {/* Grid at second column */}
                    <div className="col-right">
                        <Socials socials={user.socials} />
                        <Link to="/hero/shoutouts">
                            <MenuButton
                                text="Shoutouts"
                                color="#213b77"
                                emoji={<span style={emojiStyle}>🗣️</span>}
                            />
                        </Link>
                        <Link to="/hero/wallet">
                            <MenuButton
                                text="Wallet"
                                color="#213b77"
                                emoji={<span style={emojiStyle}>💰</span>}
                            />
                        </Link>
                        <Link to="/hero/partner-shops/">
                            <MenuButton
                                text="Partner Shops"
                                color="#213b77"
                                emoji={<span style={emojiStyle}>🤜 🤛</span>}
                            />
                        </Link>
                        <div onClick={handleSignOut}>
                            <MenuButton
                                text="Signout"
                                color="#bb3133"
                                emoji={<span style={emojiStyle}>✌️</span>}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HeroHeader;
