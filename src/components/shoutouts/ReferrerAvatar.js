import { useState, useEffect } from "react";
import { firebase, db } from "../../services/firebase/firebase-config";

import Skeleton from "@mui/material/Skeleton";

import Avatar from "@mui/material/Avatar";

function ReferrerAvatar({ referrerId }) {
    const [referrer, setReferrer] = useState();

    useEffect(() => {
        db.collection("users")
            .doc(referrerId)
            .get()
            .then((doc) => {
                console.log("Que Shoutout: ", doc);
                setReferrer({
                    referrerId: referrerId,
                    ...doc.data(),
                });
            })
            .catch((error) => {
                console.log("Error geting Referrer info: ", error);
            });
    }, []);

    console.log("Shoutout in Action bar: ", referrer);

    if (!referrer) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "10px",
                }}
                className="hero-home__container"
            >
                <Skeleton variant="rectangular" width={350} height={218} />
            </div>
        );
    }

    return (
        <Avatar
            loading="lazy"
            alt="User Who Uploaded Video"
            src={referrer.avatarUrl}
        />
    );
}

export default ReferrerAvatar;
