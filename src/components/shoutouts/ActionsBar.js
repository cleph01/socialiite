import { useContext, useRef, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import LikeAction from "./LikeAction";

import IconButton from "@mui/material/IconButton";
import ReferrerAvatar from "./ReferrerAvatar";

import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

import { db, firebase } from "../../services/firebase/firebase-config";
import "../../lib/scss/components/shops/actions-bar.scss";

function ActionsBar({ shoutout, handleCommentFocus, setBusiness }) {
    const { authUser, userDispatch, userState } = useContext(UserContext);
    const history = useHistory();

    const [likes, setLikes] = useState();
    const [followers, setFollowers] = useState();

    useEffect(() => {
        if (authUser) {
            db.collection("users")
                .doc(authUser.uid)
                .get()
                .then((user) => {
                    userDispatch({
                        type: "USER/SET_EXISTING_USER",
                        payload: {
                            ...user.data(),
                            userId: user.id,
                        },
                    });
                })
                .catch((error) => {
                    console.log("Error geting business info: ", error);
                });
        }

        setLikes(shoutout.likes.length);
    }, []);

    
    return (
        <div className="actions__bar">
            <div className="actions__wrapper">
                <LikeAction
                    userId={authUser ? authUser.uid : null}
                    likes={shoutout.likes}
                    setLikes={setLikes}
                    posterId={shoutout.userId}
                />
                <IconButton
                    disabled={authUser ? false : true}
                    onClick={handleCommentFocus}
                >
                    <ChatBubbleOutlineIcon />
                </IconButton>

                <div className="likes-followers__wrapper">
                    {likes === 1 ? `${likes} like` : `${likes} likes`}
                </div>
            </div>
            <div>
                <ReferrerAvatar referrerId={shoutout.userId} />
            </div>
        </div>
    );
}

export default ActionsBar;
