import { useState, useContext } from "react";
import { db, firebase } from "../../services/firebase/firebase-config";
import { UserContext } from "../contexts/UserContext";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

function Auth({ referrerId, setCheckedIn }) {
    const [loadingUser, setLoadingUser] = useState(false);

    const { userDispatch, userState } = useContext(UserContext);

    if (loadingUser) {
        return (
            <Box sx={{ display: "flex" }}>
                <CircularProgress color="inherit" />
                <div>Logging You In!! 🙌</div>
            </Box>
        );
    }
    return (
        <StyledFirebaseAuth
            uiConfig={{
                signInFlow: "redirect",
                signInOptions: [
                    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
                ],

                callbacks: {
                    signInSuccessWithAuthResult: (authUser, redirectUrl) => {
                        setLoadingUser(true);

                        if (!!referrerId) {
                            localStorage.setItem("referrerId", referrerId);
                        }

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
                                            payload: {
                                                ...user.data(),
                                                userId: user.id,
                                            },
                                        });
                                    } else {
                                        // If doesn't Exist, Create New User and set State with Reducer

                                        // Create searchable keyword array for firestore user autocomplete search
                                        const searchableKeywords = [];

                                        for (
                                            let i = 1;
                                            i <= authUser.email.length;
                                            i++
                                        ) {
                                            searchableKeywords.push(
                                                authUser.email.slice(0, i)
                                            );
                                        }

                                        const newUserData = {
                                            displayName: authUser.displayName,
                                            avatarUrl: authUser.photoURL,

                                            email: authUser.email,
                                            phoneNumber: authUser.phoneNumber,
                                            timestamp: Date.now(),
                                            aboutMe:
                                                "Tell Us Something About You!! 🙌",
                                            socials: {},
                                            followingFriends: [],
                                            followersFriends: [],
                                            followingBusinesses: [],
                                            openWallet: true,
                                            userId: authUser.uid,
                                            referrals: [],
                                            searchableKeywords:
                                                searchableKeywords,
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
                                                console.log(
                                                    "Error Creating New User: ",
                                                    error
                                                );
                                            });
                                    }
                                })
                                .catch((error) => {
                                    console.log(
                                        "Error Checking User Exists: ",
                                        error
                                    );
                                });
                        }

                        return false;
                    },
                },
            }}
            firebaseAuth={firebase.auth()}
        />
    );
}

export default Auth;
