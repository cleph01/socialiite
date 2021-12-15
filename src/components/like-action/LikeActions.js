import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { firebase, db } from "../../services/firebase/firebase-config";

function LikeAction({ userId, postUserId, postId, likedPost, totalLikes }) {
    console.log("Liked Shop: ", likedPost);

    const [toggleLiked, setToggleLiked] = useState(likedPost);
    const [likes, setLikes] = useState(totalLikes);

    const handleToggleLiked = async () => {
        setToggleLiked((toggleLiked) => !toggleLiked);

        await db
            .collection("shoutouts")
            .doc(postId)
            .update({
                likes: toggleLiked
                    ? firebase.firestore.FieldValue.arrayRemove(userId)
                    : firebase.firestore.FieldValue.arrayUnion(userId),
            });

        setLikes((likes) => (toggleLiked ? likes - 1 : likes + 1));
    };

    console.log("Toggle Liked: ", toggleLiked);
    return (
        <IconButton aria-label="add to favorites" onClick={handleToggleLiked}>
            <LocalFireDepartmentIcon
                style={{ color: toggleLiked ? "#e93f33" : "#bdbdbd" }}
            />
        </IconButton>
    );
}

export default LikeAction;
