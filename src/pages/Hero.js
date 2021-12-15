import { useState, useEffect, useContext } from "react";

import { Route } from "react-router-dom";

import { UserContext } from "../contexts/UserContext";

import HeroHeader from "../components/hero/HeroHeader";
import PinModal from "../components/modals/pin-modal/PinModal";

import Shoutouts from "../components/shoutouts/Shoutouts";
import ShoutoutMedia from "../components/shoutouts/ShoutoutMedia";
import PartnerShops from "../components/partner-shops/PartnerShops";
import Wallet from "../components/wallet/Wallet";
import Notifications from "../components/notifications/Notifications";
import UploadShoutout from "../components/shoutouts/UploadShoutout";

import "../lib/scss/pages/hero-home.scss";

import { db } from "../services/firebase/firebase-config";

const user = {
    avartarUrl: "https://www.w3schools.com/howto/img_avatar.png",
    displayName: "charlesmontoya79@gmail.com",
    socials: {
        facebook: "facbook",
        youtube: "youtube",
        instagram: "instagram",
        twitter: "twitter",
        linkedIn: "linkedIn",
        github: "github",
    },
};
function Hero({ authUser }) {
    const { userState, userDispatch } = useContext(UserContext);

    const [openPinModal, setOpenPinModal] = useState(false);
    const handleClosePinModal = () => {
        setOpenPinModal(false);
    };
    useEffect(() => {
        // Try and Refactor with Async/Await

        // Check if User Exists

        if (!userState.userId) {
            db.collection("users")
                .doc(authUser.uid)
                .get()
                .then((user) => {
                    // If User exists,
                    //Set User Context with Reducer

                    if (user.exists) {
                        console.log("User Exists");
                        userDispatch({
                            type: "USER/SET_EXISTING_USER",
                            payload: { ...user.data(), userId: user.id },
                        });
                    } else {
                        // If doesn't Exist, Create New User and set State with Reducer

                        const newUserData = {
                            displayName: authUser.displayName,
                            avatarUrl: authUser.photoURL,
                            seller: false,
                            email: authUser.email,
                            phoneNumber: authUser.phoneNumber,
                            timestamp: Date.now(),
                            aboutMe: "Tell Us Something About You!! 🙌",
                            socials: {},
                            followingFriends: [],
                            followersFriends: [],
                            followingBusinesses: [],
                            openWallet: true,
                            userId: authUser.uid,
                        };

                        db.collection("users")
                            .doc(authUser.uid)
                            .set(newUserData)
                            .then((docRef) => {
                                userDispatch({
                                    type: "USER/CREATE_NEW_USER",
                                    payload: newUserData,
                                });

                                console.log(
                                    "Created User with Id: ",
                                    authUser.uid
                                );
                            })
                            .catch((error) => {
                                console.log("Error Creating New User: ", error);
                            });
                    }
                })
                .catch((error) => {
                    console.log("Error Checking User Exists: ", error);
                });
        }
    }, []);

    return (
        <div
            className="hero-home__container"
            style={{
                backgroundImage: 'url("/logo192.png")',
                marginBottom: "125px",
            }}
        >
            <HeroHeader user={userState} setOpenPinModal={setOpenPinModal} />

            <Route path="/hero/shoutouts">
                <Shoutouts />
            </Route>

            <Route path="/hero/shoutout/:postId">
                <ShoutoutMedia />
            </Route>

            <Route path="/hero/upload">
                <UploadShoutout />
            </Route>

            <Route path="/hero/partner-shops">
                <PartnerShops />
            </Route>

            <Route path="/hero/wallet">
                <Wallet />
            </Route>

            <Route path="/hero/notifications">
                <Notifications />
            </Route>

            <PinModal
                userId={authUser.uid}
                openPinModal={openPinModal}
                handleClosePinModal={handleClosePinModal}
            />
        </div>
    );
}

export default Hero;
