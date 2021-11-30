import { useEffect } from "react";

import { db } from "../services/firebase/firebase-config";

function Trade() {
    useEffect(() => {
        db.collectionGroup("wallet")
            .where("publicWallet", "==", true)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log(doc.id, "=>", doc.data());
                });
            })
            .catch((error) => {
                console.log("error getting collectionGroup: ", error);
            });
    }, []);

    return <div>Trade Room</div>;
}

export default Trade;
