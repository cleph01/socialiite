import { useState, useEffect } from "react";

export default function useGapi() {
    const [GoogleAuthObj, setGoogleAuthObj] = useState();

    const loadApi = async () => {
        await window.gapi.load("client:auth2", initClient);
    };

    const initClient = () => {
        window.gapi.client
            .init({
                apiKey: process.env.REACT_APP_API_KEY,
                clientId: process.env.REACT_APP_CLIENT_ID,
                scope: process.env.REACT_APP_SCOPE,
                discoveryDocs: [
                    "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest",
                ],
            })
            .then(() => {
                setGoogleAuthObj(window.gapi.auth2.getAuthInstance());
                console.log(
                    "Success Got Client Obj: ",
                    window.gapi.auth2.getAuthInstance()
                );
            })
            .catch((error) => {
                console.log("Error Inializing Gapi: ", error);
            });
    };

    useEffect(() => {
        loadApi();
    }, []);

    return GoogleAuthObj;
}
