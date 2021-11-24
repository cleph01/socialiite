import { Link } from "react-router-dom";

import Avatar from "@mui/material/Avatar";
import Socials from "./Socials";
import Button from "../Button";

import "../../lib/scss/components/hero/hero-header.scss";

const emojiStyle = {
    display: "inline-block",
    fontSize: "24px",
};

function HeroHeader({ user }) {
    console.log("User at Hero: ", user);
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
                            <Button
                                text="Shoutouts"
                                color="#213b77"
                                emoji={<span style={emojiStyle}>🗣️</span>}
                            />
                        </Link>
                        <Link to="/hero/wallet">
                            <Button
                                text="Wallet"
                                color="#213b77"
                                emoji={<span style={emojiStyle}>💰</span>}
                            />
                        </Link>
                        <Link to="/hero/partner-shops/">
                            <Button
                                text="Partner Shops"
                                color="#213b77"
                                emoji={<span style={emojiStyle}>🤜 🤛</span>}
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HeroHeader;
