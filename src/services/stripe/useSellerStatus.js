import { useState, useEffect } from "react";
// import { firebase } from "../firebase/firebase-config";
import isUserSeller from "./isUserSeller";

export default function useSellerStatus(user) {
    const [sellerStatus, setSellerStatus] = useState(false);

    useEffect(() => {
        if (user) {
            const checkSellerStatus = async function () {
                setSellerStatus(await isUserSeller());
            };
            checkSellerStatus();
        }
    }, [user]);

    return sellerStatus;
}
