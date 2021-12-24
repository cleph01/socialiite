import React, { useState, useContext } from "react";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import { UserContext } from "../../contexts/UserContext";

export default function SignUp({setAccessToken}) {
    const [showLogin, setShowLogin] = useState(true);
    const [showLogout, setShowLogout] = useState(false);

    const { userState, userDispatch } = useContext(UserContext);

    const successGoogle = (resp) => {
        console.log("Google response: ", resp);
        
        userDispatch({
            type: "USER/SET_ACCESS_TOKEN",
            payload: resp.accessToken,
        });

        setShowLogin(false);
        setShowLogout(true);
    };

    const failureGoogle = (resp) => {
        console.log("Google response: ", resp);
    };

    const logoutGoogle = () => {
        console.log("Logged out of Google:");
        setShowLogin(true);
        setShowLogout(false);
        userDispatch({
            type: "USER/SET_ACCESS_TOKEN",
            payload: null,
        });
    };

    return (
        <div>
            {showLogin ? (
                <GoogleLogin
                    clientId={process.env.REACT_APP_CLIENT_ID}
                    buttonText="Login"
                    onSuccess={successGoogle}
                    onFailure={failureGoogle}
                    responseType="token"
                    redirectUri={process.env.REACT_APP_REDIRECT_URI}
                    scopes={[process.env.REACT_APP_SCOPE]}
                />
            ) : null}

            {showLogout ? (
                <GoogleLogout
                    clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
                    buttonText="Logout"
                    onLogoutSuccess={logoutGoogle}
                />
            ) : null}

            <p>
                {userState.googleToken !== null
                    ? `My token: ${userState.googleToken}`
                    : "No token yet."}
            </p>
        </div>
    );
}
