import { useEffect, useState } from "react";

import Shoutout from "./Shoutout";

import ImageList from "@mui/material/ImageList";

import UpcomingMessage from "../UpcomingMessage";

import "../../lib/scss/components/shoutouts/shoutouts.scss";

import { db } from "../../services/firebase/firebase-config";

function Shoutouts() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const authUser = localStorage.getItem("authUser");
        // Get Posts
        db.collection("user")
            .doc(authUser.uid)
            .collection("posts")
            .orderBy("timestamp", "desc")
            .get()
            .then((posts) => {
                console.log("Posts in query: ", posts);

                setPosts(
                    posts.docs.map((doc) => ({
                        postId: doc.id,
                        post: doc.data(),
                    }))
                );
            })
            .catch((error) => {
                console.log("Error Getting Posts: ", error);
            });
    }, []);

    return (
        <div className="shoutouts-container">
            {posts.length > 0 ? (
                <ImageList sx={{ width: 500 }}>
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
