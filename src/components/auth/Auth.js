import { useState } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { firebase } from "./firebase/firebase_config";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

function Auth({ referrerId, redirectPath }) {
    const [loadingUser, setLoadingUser] = useState(false);

    if (loadingUser) {
        return (
            <Box sx={{ display: "flex" }}>
                <CircularProgress />
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
                signInSuccessUrl: redirectPath,
                callbacks: {
                    signInSuccessWithAuthResult: (authUser, redirectUrl) => {
                        setLoadingUser(true);

                        if (!!referrerId) {
                            localStorage.setItem("referrerId", referrerId);
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
