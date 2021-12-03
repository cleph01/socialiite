import { useEffect, useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";

import Avatar from "@mui/material/Avatar";
import Socials from "./Socials";
import MenuButton from "../MenuButton";

import "../../lib/scss/components/hero/hero-header.scss";

import { auth } from "../../services/firebase/firebase-config";

import { db } from "../../services/firebase/firebase-config";

const emojiStyle = {
    display: "inline-block",
    fontSize: "24px",
};

function HeroHeader({ user, setOpenPinModal }) {
    let history = useHistory();

    const { authUser } = useContext(UserContext);

    const [notifications, setNotifications] = useState([]);

    const handleSignOut = () => {
        console.log("clicking signout");
        auth.signOut();

        history.push("/login");
    };

    useEffect(() => {
        const unsubscribe = db
            .collection("trades")
            .where("ownerId", "==", authUser.uid)
            .where("settled", "==", false)
            .onSnapshot(
                (snapshot) => {
                    console.log("Query SnapShot: ", snapshot);

                    setNotifications(
                        snapshot.docs.map((doc) => ({
                            tradeId: doc.id,
                            ...doc.data(),
                        }))
                    );
                },
                (error) => {
                    console.log("Error Getting Notifications: ", error);
                }
            );

        return () => {
            unsubscribe();
        };
    }, []);

    console.log("Notifications: ", notifications);
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
                        <div className="hero__displayName">
                            {authUser.displayName}
                        </div>
                        <div className="hero__stats_wrapper">
                            <div className="hero__stats">
                                <div className="hero__stat">356</div>
                                <div className="hero__stat__label">
                                    Referrals
                                </div>
                            </div>
                            <div className="hero__stats">
                                <div className="hero__stat">693</div>
                                <div className="hero__stat__label">
                                    Followers
                                </div>
                            </div>
                            <div className="hero__stats">
                                <div className="hero__stat">936</div>
                                <div className="hero__stat__label">
                                    Following
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    {/* Grid at second column */}
                    <div className="col-right">
                        <Socials socials={user.socials} />
                        <div className="col-right-subcol-wrapper">
                            <div className="col-right-subcol">
                                <div onClick={() => setOpenPinModal(true)}>
                                    <MenuButton
                                        text="Your PIN"
                                        color="#213b77"
                                        emoji={
                                            <span style={emojiStyle}>🤫</span>
                                        }
                                    />
                                </div>
                                <Link to="/hero/shoutouts">
                                    <MenuButton
                                        text="Shoutouts"
                                        color="#213b77"
                                        emoji={
                                            <span style={emojiStyle}>📣</span>
                                        }
                                    />
                                </Link>

                                <Link to="/hero/wallet">
                                    <MenuButton
                                        text="Wallet"
                                        color="#213b77"
                                        emoji={
                                            <span style={emojiStyle}>💵</span>
                                        }
                                    />
                                </Link>
                                <Link to="/hero/partner-shops/">
                                    <MenuButton
                                        text="Partners"
                                        color="#213b77"
                                        emoji={
                                            <span style={emojiStyle}>🤜🤛</span>
                                        }
                                    />
                                </Link>
                            </div>
                            <div className="col-right-subcol">
                                <div
                                    className={
                                        notifications.length > 0 ? "glow" : null
                                    }
                                >
                                    <Link to="/hero/notifications">
                                        <MenuButton
                                            text="Offers"
                                            color="#213b77"
                                            emoji={
                                                <span style={emojiStyle}>
                                                    🔔
                                                </span>
                                            }
                                        />
                                    </Link>
                                </div>
                                <Link to="/trade">
                                    <MenuButton
                                        text="Trade"
                                        color="#213b77"
                                        emoji={
                                            <span style={emojiStyle}>🤝</span>
                                        }
                                    />
                                </Link>
                                <Link to="/hero/partner-shops/">
                                    <MenuButton
                                        text="Search"
                                        color="#213b77"
                                        emoji={
                                            <span style={emojiStyle}>🔍</span>
                                        }
                                    />
                                </Link>

                                <div onClick={handleSignOut}>
                                    <MenuButton
                                        text="Signout"
                                        color="#bb3133"
                                        emoji={
                                            <span style={emojiStyle}>✌️</span>
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HeroHeader;
