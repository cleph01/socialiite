import { useState, useEffect } from "react";
import firebase from "firebase";

function useAuthListener() {
    const [authUser, setAuthUser] = useState(
        JSON.parse(localStorage.getItem("authUser"))
    );

    useEffect(() => {
        const listener = firebase.auth().onAuthStateChanged((authUser) => {
            // we have a user, therefore we can store the user in localstorage
            if (authUser) {
                localStorage.setItem("authUser", JSON.stringify(authUser));
                setAuthUser(authUser);
            } else {
                // we don't have an authUser, therefore clear the localstorage
                localStorage.removeItem("authUser");
                setAuthUser(null);
            }
        });
        return () => {
            listener();
        };
    }, []);

    return { authUser };
}
export default useAuthListener;
