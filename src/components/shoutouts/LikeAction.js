import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { firebase, db } from "../../services/firebase/firebase-config";

function LikeAction({ userId, likes, setLikes, posterId }) {
    const [toggleLiked, setToggleLiked] = useState(likes.includes(userId));

    const handleToggleLiked = async () => {
        setToggleLiked((toggleLiked) => !toggleLiked);

        await db
            .collection("users")
            .doc(posterId)
            .update({
                likes: toggleLiked
                    ? firebase.firestore.FieldValue.arrayRemove(userId)
                    : firebase.firestore.FieldValue.arrayUnion(userId),
            });

        setLikes((likes) => (toggleLiked ? likes - 1 : likes + 1));
    };

    console.log("Toggle Liked: ", toggleLiked);
    return (
        <IconButton
            disabled={userId === null ? true : false}
            onClick={handleToggleLiked}
        >
            <LocalFireDepartmentIcon
                style={{
                    color: toggleLiked ? "#e93f33" : "#bdbdbd",
                }}
            />
        </IconButton>
    );
}

export default LikeAction;
