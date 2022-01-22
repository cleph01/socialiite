import { useEffect, useState, useContext } from "react";

import { UserContext } from "../../contexts/UserContext";

import Shoutout from "./Shoutout";

import ImageList from "@mui/material/ImageList";

import UpcomingMessage from "../UpcomingMessage";

import Skeleton from "@mui/material/Skeleton";

import "../../lib/scss/components/shoutouts/shoutouts.scss";

import { db } from "../../services/firebase/firebase-config";

function Shoutouts() {
    const [posts, setPosts] = useState();
    const { authUser } = useContext(UserContext);

    useEffect(() => {
        // Get Posts
        db.collection("shoutouts")
            .where("userId", "==", authUser.uid)

            .get()
            .then((querySnapshot) => {
                console.log("Posts in query: ", querySnapshot.docs);

                setPosts(
                    querySnapshot.docs.map((doc) => ({
                        postId: doc.id,
                        ...doc.data(),
                    }))
                );
            })
            .catch((error) => {
                console.log("Error Getting Posts: ", error);
            });
    }, []);

    if (!posts) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "10px",
                }}
            >
                <Skeleton variant="rectangular" width={350} height={218} />
            </div>
        );
    }

    return (
        <div className="shoutouts-container">
            {posts.length > 0 ? (
                <ImageList sx={{ width: "100%" }}>
                    {posts.map((item, i) => (
                        <Shoutout key={i} item={item} />
                    ))}
                </ImageList>
            ) : (
                <UpcomingMessage
                    message="Post a Shoutout to Get Paid!!"
                    emoji="💵"
                />
            )}
        </div>
    );
}

export default Shoutouts;
