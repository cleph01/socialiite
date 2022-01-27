import { useState, useEffect } from "react";
import Skeleton from "@mui/material/Skeleton";

import { firebase, db } from "../../services/firebase/firebase-config";

function Comments({ shoutoutId, comments, setComments }) {
    
    useEffect(() => {
        db.collection("shops")
            .doc(shoutoutId)
            .collection("comments")
            .get()
            .then((querySnapshot) => {
                setComments(
                    querySnapshot.docs.map((doc) => ({
                        commentId: doc.id,
                        ...doc.data(),
                    }))
                );
            })
            .catch((error) => {
                console.log("Error geting business info: ", error);
            });
    }, []);

    if (!comments) {
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
        <div>
            <small>Latest Reviews:</small>
            {comments.map((comment, index) => (
                <p key={index}>
                    <strong>{comment.displayName}</strong> {comment.comment}
                </p>
            ))}
        </div>
    );
}

export default Comments;
