import { useState, useEffect, useContext, forwardRef, useRef } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import PhoneIcon from "@mui/icons-material/Phone";
import Skeleton from "@mui/material/Skeleton";

import NavBar from "../components/NavBar";
import ActionsBar from "../components/shoutouts/ActionsBar";
import Comments from "../components/shoutouts/Comments";

import "../lib/scss/pages/shop.scss";

import { firebase, db } from "../services/firebase/firebase-config";

function Shoutout() {
    const commentRef = useRef();

    const { authUser, userState } = useContext(UserContext);
    const { shoutoutId, businessId } = useParams();
    const [shoutout, setShoutout] = useState();

    const [business, setBusiness] = useState();

    const [comment, setComment] = useState([]);
    const [comments, setComments] = useState([]);

    const handleCommentFocus = () => {
        commentRef.current.focus();
    };

    const handlePostComment = (event) => {
        event.preventDefault();

        db.collection("shoutouts")
            .doc(shoutoutId)
            .collection("comments")
            .add({
                comment: comment,
                displayName: userState.displayName,
            })
            .then(() => {
                console.log("Successfully Adding Comment to Business");

                setComment([]);
            })
            .catch((error) => {
                console.log("Error Adding Comment to Business: ", error);
            });

        setComments((prevState) => [
            ...prevState,

            {
                comment: comment,
                displayName: userState.displayName,
            },
        ]);
    };

    /**
     * START UseEffects
     */

    useEffect(() => {
        db.collection("shoutouts")
            .doc(shoutoutId)
            .get()
            .then((doc) => {
                console.log("Que Shoutout: ", doc);
                setShoutout({
                    shoutoutId: shoutoutId,
                    ...doc.data(),
                });
            })
            .catch((error) => {
                console.log("Error geting business info: ", error);
            });
    }, [shoutoutId]);

    useEffect(() => {
        // if User is Logged in, Check if Biz relationship exists

        db.collection("shops")
            .doc(businessId)
            .get()
            .then((doc) => {
                if (doc.exists) {
                    setBusiness(doc.data());
                }
            })
            .catch((error) => {
                console.log("Error Getting Business Info: ", error);
            });
    }, []);

    /**
     * END UseEffects
     */

    console.log("Business at Shop page: ", shoutout);

    console.log("User State at shop: ", userState);

    if (!shoutout && !business) {
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
        <div className="container">
            {authUser && <NavBar />}
            <Card sx={{ maxWidth: 345 }}>
                <CardHeader
                    avatar={
                        <Avatar
                            loading="lazy"
                            alt={business?.businessName}
                            src={business?.logoUrl}
                            sx={{
                                /* bgcolor: red[500],*/
                                width: 50,
                                height: 50,
                                margin: "auto",
                                padding: "10px",
                                border: "1px solid #f0f0f0",
                            }}
                        />
                    }
                    action={
                        <a
                            href={`tel:${business?.phone}`}
                            style={{ textDecoration: "none" }}
                        >
                            <IconButton aria-label="settings">
                                <PhoneIcon />
                            </IconButton>
                        </a>
                    }
                    title={shoutout.businessName}
                    subheader={`${business?.address}, ${business?.city} ${business?.state}`}
                />
                <CardMedia
                    component="img"
                    height="194"
                    image={shoutout.imageUrl}
                    alt="post"
                />
                <CardContent>
                    <ActionsBar
                        shoutout={shoutout}
                        handleCommentFocus={handleCommentFocus}
                        setBusiness={setBusiness}
                    />
                    <Divider />
                    <h3>Caption</h3>

                    <div className="business-description">
                        {shoutout.caption}
                    </div>

                    <br />
                    <div className="shop__comments">
                        <Comments
                            shoutoutId={shoutoutId}
                            comments={comments}
                            setComments={setComments}
                        />
                    </div>

                    {authUser && (
                        <form className="shop__commentBox">
                            <input
                                className="shop__input"
                                type="comment"
                                placeholder="Add a comment..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                ref={commentRef}
                            />

                            <button
                                disabled={!comment}
                                className="post__button"
                                type="submit"
                                onClick={handlePostComment}
                            >
                                Post
                            </button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default Shoutout;
