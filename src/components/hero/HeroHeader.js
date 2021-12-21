import { useEffect, useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";

import Avatar from "@mui/material/Avatar";
import Socials from "./Socials";
import MenuButton from "../MenuButton";
import CircleMenu from "./CircleMenu";

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

            <div className="hero-header__container">
                <div className="col">
                    <Avatar
                        src={user.avatarUrl}
                        alt={user.displayName}
                        sx={{ width: 56, height: 56 }}
                    />
                    <div className="hero__details">
                        <div className="hero__displayName">
                            {user.displayName}
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
                    <Socials socials={user.socials} />
                    <div className="col-right-subcol-wrapper">
                        <CircleMenu />
                    </div>
                </div>

                <div className="onboard-btn">Get Paid Today!</div>
            </div>
        </>
    );
}

export default HeroHeader;
