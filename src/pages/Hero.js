import { useState, useEffect, useContext } from "react";

import { Route } from "react-router-dom";

import { UserContext } from "../contexts/UserContext";

import HeroHeader from "../components/hero/HeroHeader";
import PinModal from "../components/modals/pin-modal/PinModal";
import Shoutouts from "../components/shoutouts/Shoutouts";
import PartnerShops from "../components/partner-shops/PartnerShops";
import Wallet from "../components/wallet/Wallet";
import Notifications from "../components/notifications/Notifications";
import UploadShoutout from "../components/shoutouts/UploadShoutout";
import UploadSuccess from "../components/shoutouts/UploadSuccess";
import MyShops from "../components/my-shops/MyShops";
import NewShop from "../components/my-shops/NewShop";
import EditShop from "../components/my-shops/EditShop";
import InviteNewShop from "../components/invite-new-shop/InviteNewShop";
import Search from "../components/search/Search";
import FollowingShops from "../components/following-shops/FollowingShops";

import "../lib/scss/pages/hero-home.scss";

import { db } from "../services/firebase/firebase-config";

function Hero({ authUser }) {
    const { userState, userDispatch } = useContext(UserContext);

    const [openPinModal, setOpenPinModal] = useState(false);
    const handleClosePinModal = () => {
        setOpenPinModal(false);
    };
    useEffect(() => {
        // Try and Refactor with Async/Await

        // To be deleted after test users are set

        // const searchableKeywords = [];

        // for (let i = 1; i <= authUser.email.length; i++) {
        //     searchableKeywords.push(authUser.email.slice(0, i));
        // }

        // db.collection("users")
        //     .doc(authUser.uid)
        //     .update({
        //         searchableKeywords: searchableKeywords,
        //     })
        //     .then(() => console.log("Searchable"));

        // End of To Be Deleted

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

                        // Create searchable keyword array for firestore user autocomplete search

                        const searchableKeywords = [];

                        for (let i = 1; i <= authUser.email.length; i++) {
                            searchableKeywords.push(authUser.email.slice(0, i));
                        }

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
                            referrals: [],
                            searchableKeywords: searchableKeywords,
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
                marginBottom: "125px",
            }}
        >
            <HeroHeader user={userState} setOpenPinModal={setOpenPinModal} />

            <Route path="/hero/shoutouts">
                <Shoutouts />
            </Route>

            <Route path="/hero/upload">
                <UploadShoutout />
            </Route>

            <Route path="/hero/upload-success">
                <UploadSuccess />
            </Route>

            <Route path="/hero/partner-shops">
                <PartnerShops />
            </Route>

            <Route path="/hero/following-shops">
                <FollowingShops />
            </Route>

            <Route path="/hero/wallet">
                <Wallet />
            </Route>

            <Route path="/hero/notifications">
                <Notifications />
            </Route>
            <Route path="/hero/invite-new-shop">
                <InviteNewShop />
            </Route>

            <Route path="/hero/my-shops/new">
                <NewShop />
            </Route>

            <Route path="/hero/my-shops/edit/:businessId">
                <EditShop />
            </Route>

            <Route path="/hero/my-shops">
                <MyShops />
            </Route>

            <Route path="/hero/search">
                <Search />
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
