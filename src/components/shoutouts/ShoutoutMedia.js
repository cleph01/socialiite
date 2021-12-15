import { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { useParams } from "react-router";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import YouTubeIcon from "@mui/icons-material/YouTube";
import PhotoIcon from "@mui/icons-material/Photo";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ShareIcon from "@mui/icons-material/Share";

import Skeleton from "@mui/material/Skeleton";

import Box from "@mui/material/Box";

import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

import ForumIcon from "@mui/icons-material/Forum";

import platform from "platform-detect/os.mjs";

import encodeurl from "encodeurl";
import { InlineShareButtons } from "sharethis-reactjs";

import MediaPlayer from "../media-player/MediaPlayer";
import LikeAction from "../like-action/LikeActions";

import { firebase, db } from "../../services/firebase/firebase-config";

import "../../lib/scss/components/shoutouts/post.scss";

const style = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 355,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

function ShoutoutMedia() {
    const commentRef = useRef();

    const { userState, authUser } = useContext(UserContext);

    const { userId, postId } = useParams();

    // function Post(props) {

    const [post, setPost] = useState();
    const [comment, setComment] = useState([]);
    const [comments, setComments] = useState([]);

    // businessId for share modal
    const [shareBusiness, setShareBusiness] = useState();
    // State to control Share Modal
    const [openShareModal, setOpenShareModal] = useState(false);

    // Hold Form Values
    const [values, setValues] = useState({
        caption: "",
        youtubeId: "lQggSxDGy4Q",
        imageUrl: "",
    });

    const handleCommentFocus = () => {
        commentRef.current.focus();
    };

    const handleCloseShareModal = () => setOpenShareModal(false);

    const encodeMsg = encodeurl(
        `Wanted to share this with you. Check them out. ${
            shareBusiness
                ? shareBusiness.businessName +
                  ": http://localhost:3000/shops/" +
                  shareBusiness.businessId
                : "undefined"
        }/${(userState, authUser.uid)}`
    );

    const smsMessage =
        platform.macos || platform.ios
            ? `sms:&body=${encodeMsg}`
            : `sms:?body=${encodeMsg}`;

    useEffect(() => {
        db.collection("shoutouts")
            .doc(postId)
            .get()
            .then((doc) => {
                setPost(doc.data());
            })
            .catch((error) => {
                console.log("Error geting Post: ", error);
            });
    }, []);

    const postComment = (event) => {
        event.preventDefault();

        db.collection("user")
            .doc(authUser.userId)
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .add({
                text: comment,
                username: authUser.displayName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });

        setComment("");
    };

    console.log("Post: ", post);
    console.log("Url User: ", authUser);

    if (!post) {
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
        <>
            <div className="post__container">
                <Card
                    sx={{
                        minWidth: 350,
                        maxWidth: 350,
                    }}
                >
                    <CardHeader
                        avatar={
                            <Avatar
                                loading="lazy"
                                alt={authUser.displayName}
                                src={authUser.avatarUrl}
                            />
                        }
                        title={authUser.displayName}
                        subheader={post.businessName}
                        action={
                            <ShareIcon
                                sx={{ color: "#7c7c7c", fontSize: "26px" }}
                                onClick={() => {
                                    setShareBusiness({
                                        businessId: post.businessId,
                                        businessName: post.businessName,
                                    });
                                    setOpenShareModal(true);
                                    console.log(
                                        "Business at Post: ",
                                        post.businessId
                                    );
                                }}
                            />
                        }
                    />
                    <CardContent>
                        <MediaPlayer srcUrl={post.postUrl} />
                        <div className="actions__bar">
                            <div className="actions__wrapper">
                                <LikeAction
                                    userId={(userState, authUser.userId)}
                                    postUserId={userId}
                                    postId={postId}
                                    likedPost={post.likes.includes(
                                        userState,
                                        authUser.userId
                                    )}
                                    totalLikes={post.likes.length}
                                />
                                <ChatBubbleOutlineIcon
                                    className="chatBubble-btn"
                                    onClick={handleCommentFocus}
                                />
                                <div className="likes-followers__wrapper">
                                    {post.likes.length === 1
                                        ? `${post.likes.length} like`
                                        : `${post.likes.length} likes`}{" "}
                                </div>

                                <Link to={`/shops/${post.businessId}`}>
                                    <div className="visit-business-btn">
                                        Business{"   "}
                                        <OpenInNewIcon className="newPage-icon" />
                                    </div>
                                </Link>
                                <Link to={`/user/${userId}`}>
                                    <div className="visit-user-btn">
                                        Socialiite{"   "}
                                        <OpenInNewIcon className="newPage-icon" />
                                    </div>
                                </Link>
                            </div>
                        </div>
                        <Divider />

                        <div className="post__text">
                            <p>
                                <strong>{authUser.displayName} </strong>
                                &nbsp;{post.caption}
                            </p>
                        </div>

                        <Divider />

                        <div className="post__comments">
                            <small>Latest Reviews:</small>
                            {comments.map((comment, index) => (
                                <p key={index}>
                                    <strong>{comment.username}</strong>{" "}
                                    {comment.text}
                                </p>
                            ))}
                        </div>

                        {
                            (userState,
                            authUser.isAuthenticated && (
                                <form className="post__commentBox">
                                    <input
                                        className="post__input"
                                        type="text"
                                        placeholder="Add a comment..."
                                        value={comment}
                                        onChange={(e) =>
                                            setComment(e.target.value)
                                        }
                                        ref={commentRef}
                                    />

                                    <button
                                        disabled={!comment}
                                        className="post__button"
                                        type="submit"
                                        onClick={postComment}
                                    >
                                        Post
                                    </button>
                                </form>
                            ))
                        }
                    </CardContent>
                </Card>
            </div>
            <Modal
                open={openShareModal}
                onClose={handleCloseShareModal}
                aria-labelledby="modal2-modal-title"
                aria-describedby="modal2-modal-description"
            >
                <Box sx={style}>
                    <Typography
                        id="modal2-modal-title"
                        variant="h6"
                        component="h2"
                        sx={{ textAlign: "center", borderColor: "#f0f0f0" }}
                    >
                        Shout Out Your Favorite Shops and Get Paid!
                    </Typography>
                    <Typography
                        id="modal2-modal-description"
                        sx={{ mt: 2, textAlign: "center" }}
                    >
                        Click Below and Go Social !!
                    </Typography>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: "15px",
                        }}
                    >
                        <InlineShareButtons
                            config={{
                                alignment: "center", // alignment of buttons (left, center, right)
                                color: "social", // set the color of buttons (social, white)
                                enabled: true, // show/hide buttons (true, false)
                                font_size: 16, // font size for the buttons
                                labels: "cta", // button labels (cta, counts, null)
                                language: "en", // which language to use (see LANGUAGES)
                                networks: [
                                    // which networks to include (see SHARING NETWORKS)
                                    "whatsapp",
                                    "linkedin",
                                    "messenger",
                                    "facebook",
                                    "twitter",
                                ],
                                padding: 12, // padding within buttons (INTEGER)
                                radius: 4, // the corner radius on each button (INTEGER)
                                show_total: true,
                                size: 40, // the size of each button (INTEGER)

                                // OPTIONAL PARAMETERS
                                // url: `https://smartseedtech.com/${shareBusiness.businessId}`, // (defaults to current url)
                                url: "https://www.chickenshacknyc.com/",
                                description: `Business Name: ${
                                    shareBusiness
                                        ? shareBusiness.businessName
                                        : "undefined"
                                }`, // (defaults to og:description or twitter:description)
                                title: `Business Name: ${
                                    shareBusiness
                                        ? shareBusiness.businessName
                                        : "undefined"
                                }`, // (defaults to og:title or twitter:title)
                                message: `Business Name: ${
                                    shareBusiness
                                        ? shareBusiness.businessName
                                        : "undefined"
                                }`, // (only for email sharing)
                                subject: `Business Name: ${
                                    shareBusiness
                                        ? shareBusiness.businessName
                                        : "undefined"
                                }`, // (only for email sharing)
                            }}
                        />
                        <div>
                            <center>
                                <h3>or Send a Text! </h3>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: "36px",
                                            marginRight: "20px",
                                        }}
                                    >
                                        {String.fromCodePoint(0x1f449)}
                                    </span>
                                    <a href={smsMessage}>
                                        <ForumIcon
                                            sx={{
                                                color: "#1c76d2",
                                                fontSize: "52px",
                                            }}
                                        />
                                    </a>
                                </div>
                            </center>
                        </div>
                    </div>
                </Box>
            </Modal>
        </>
    );
}

export default ShoutoutMedia;
