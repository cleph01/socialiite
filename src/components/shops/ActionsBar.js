import { useContext, useRef, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import LikeAction from "./LikeAction";

import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import LoginIcon from "@mui/icons-material/Login";

import { db, firebase } from "../../services/firebase/firebase-config";
import "../../lib/scss/components/shops/actions-bar.scss";
function ActionsBar({ business, handleCommentFocus, setBusiness }) {
    console.log("business at actionsbar: ", business);
    const { authUser, userDispatch, userState } = useContext(UserContext);
    const history = useHistory();

    const [likes, setLikes] = useState();
    const [followers, setFollowers] = useState();

    const handleFollow = () => {
        db.collection("users")
            .doc(authUser.uid)
            .update({
                followingBusinesses: firebase.firestore.FieldValue.arrayUnion(
                    business.businessId
                ),
            })
            .then(() => {
                console.log(
                    "Successfully Added Business to User FollowingBusinesses"
                );

                userDispatch({
                    type: "USER/UPDATE_USER_FOLLOWING_BIZ",
                    payload: [
                        ...userState.followingBusinesses,
                        business.businessId,
                    ],
                });
            })
            .catch((error) => {
                console.log(
                    "Error Adding Business to User FollowingBusinesses: ",
                    error
                );
            });

        db.collection("shops")
            .doc(business.businessId)
            .update({
                followers: firebase.firestore.FieldValue.arrayUnion(
                    authUser.uid
                ),
            })
            .then(() => {
                console.log(
                    "Successfully Added User to Business Info Followers Array"
                );

                setBusiness((prevState) => ({
                    ...prevState,
                    followers: [...prevState.followers, authUser.uid],
                }));
            })
            .catch((error) => {
                console.log(
                    "Error Added User to Business Info Followers Array: ",
                    error
                );
            });
    };

    const handleUnFollow = () => {
        db.collection("users")
            .doc(authUser.uid)
            .update({
                followingBusinesses: firebase.firestore.FieldValue.arrayRemove(
                    business.businessId
                ),
            })
            .then(() => {
                console.log(
                    "Successfully Added Business to User FollowingBusinesses"
                );

                userDispatch({
                    type: "USER/UPDATE_USER_FOLLOWING_BIZ",
                    payload: userState.followingBusinesses.splice(
                        userState.followingBusinesses.indexOf(
                            business.businessId
                        ),
                        0
                    ),
                });
            })
            .catch((error) => {
                console.log(
                    "Error Adding Business to User FollowingBusinesses: ",
                    error
                );
            });

        db.collection("shops")
            .doc(business.businessId)
            .update({
                followers: firebase.firestore.FieldValue.arrayRemove(
                    authUser.uid
                ),
            })
            .then(() => {
                console.log(
                    "Successfully Removed User from Business Info Followers Array"
                );

                setBusiness((prevState) => ({
                    ...prevState,
                    followers: prevState.followers.splice(
                        prevState.followers.indexOf(authUser.uid),
                        0
                    ),
                }));
            })
            .catch((error) => {
                console.log(
                    "Error Added User to Business Info Followers Array: ",
                    error
                );
            });
    };

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

        setLikes(business.likes.length);
    }, []);

    return (
        <div className="actions__bar">
            <div className="actions__wrapper">
                <LikeAction
                    userId={authUser ? authUser.uid : null}
                    business={business}
                    setLikes={setLikes}
                />
                <IconButton
                    disabled={authUser ? false : true}
                    onClick={handleCommentFocus}
                >
                    <ChatBubbleOutlineIcon />
                </IconButton>

                <div className="likes-followers__wrapper">
                    {/* 3000 likes | 5000 followers */}
                    {business.followers.length === 1
                        ? `${business.followers.length} follower`
                        : `${business.followers.length} followers`}{" "}
                    | {likes === 1 ? `${likes} like` : `${likes} likes`}
                </div>
            </div>
            <div>
                {authUser ? (
                    !userState.followingBusinesses?.includes(
                        business.businessId
                    ) ? (
                        <div className="follow-btn" onClick={handleFollow}>
                            <AddIcon className="follow-icon" /> Follow
                        </div>
                    ) : (
                        <div className="follow-btn" onClick={handleUnFollow}>
                            <RemoveIcon className="follow-icon" /> UnFollow
                        </div>
                    )
                ) : (
                    <div
                        className="follow-btn"
                        onClick={() => {
                            history.push("/login");

                            localStorage.setItem(
                                "redirectPath",
                                `/shops/${business.businessId}`
                            );
                        }}
                    >
                        <LoginIcon />
                        &nbsp;&nbsp;Login
                    </div>
                )}
            </div>
        </div>
    );
}

export default ActionsBar;
