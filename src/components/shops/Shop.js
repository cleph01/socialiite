import { useState, useEffect, useContext, forwardRef, useRef } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";

import YouTubeEmbed from "./components/YouTubeEmbed.js";
import AvailablePrizes from "./components/AvailablePrizes";
import LikeAction from "./components/LikeAction";

import IconButton from "@mui/material/IconButton";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import LoginIcon from "@mui/icons-material/Login";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";

import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import ForumIcon from "@mui/icons-material/Forum";

import { InlineShareButtons } from "sharethis-reactjs";

import platform from "platform-detect/os.mjs";

import encodeurl from "encodeurl";

import "./styles/shop.scss";

import * as FUNCTIONS from "./functions/shop_functions";

import { firebase, db } from "../../firebase/firebase_config";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

function Shop() {
    const commentRef = useRef();
    const history = useHistory();

    const { userState } = useContext(UserContext);
    const { shopId } = useParams();
    const [business, setBusiness] = useState();
    const [allBizRelationships, setAllBizRelationships] = useState();
    const [userBizRelationship, setUserBizRelationship] = useState();
    const [prizes, setPrizes] = useState();
    const [walletPrize, setWalletPrize] = useState();
    const [comment, setComment] = useState([]);
    const [comments, setComments] = useState([]);
    const [openClaimModal, setOpenClaimModal] = useState(false);
    const [openShareModal, setOpenShareModal] = useState(false);
    const [alertMsg, setAlertMsg] = useState({
        message: "",
        severity: "success",
    });

    const [openSnackBar, setOpenSnackBar] = useState(false);

    const Alert = forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const handleCommentFocus = () => {
        commentRef.current.focus();
    };

    const handleOpenClaimModal = (itemObj) => {
        if (!userState.isAuthenticated) {
            setAlertMsg({
                message: "Please Login First",
                severity: "error",
            });

            setOpenSnackBar(true);
        } else if (!!allBizRelationships.includes(shopId)) {
            setAlertMsg({
                message:
                    "First Time Incentives are for First Time Customers Only",
                severity: "error",
            });

            setOpenSnackBar(true);
        } else {
            setWalletPrize(itemObj);
            setOpenClaimModal(true);
        }
    };
    const handleCloseClaimModal = () => setOpenClaimModal(false);

    const handleOpenShareModal = () => {
        if (!userState.isAuthenticated) {
            setAlertMsg({
                message: "Please Login First",
                severity: "error",
            });

            setOpenSnackBar(true);
        } else {
            setOpenShareModal(true);
        }
    };

    const handleCloseShareModal = () => setOpenShareModal(false);

    const handleAddToWallet = () => {
        // Consider writing this is a batch write

        if (
            walletPrize.prizeDetails.pointThreshold <=
            userBizRelationship.relationshipInfo.pointSum
        ) {
            const walletItem = {
                businessId: shopId,
                businessName: business.businessName,
                emoji: walletPrize.prizeDetails.emoji,
                itemDescription: walletPrize.prizeDetails.prizeDescription,
                itemId: walletPrize.prizeId,
                redeemed: false,
                // Timestamping handled in DB Function file
            };

            // Add Prize to Wallet and Update pointsSum in Biz Relationship
            FUNCTIONS.addToWallet(userState.userId, walletItem)
                .then((newWalletItemId) => {
                    // Decrement Prize Point Threshold from BizRelationship Tally
                    FUNCTIONS.decrementPoint(
                        userState.userId,
                        userBizRelationship.realtionshipId,
                        walletPrize.prizeDetails.pointThreshold
                    )
                        .then(() => {
                            console.log("PointSum successfully updated!");
                        })
                        .catch((error) => {
                            // The document probably doesn't exist.
                            console.error("Error updating PointSume: ", error);
                        });

                    setAlertMsg({
                        message: "Item Added to Wallet.",
                        severity: "success",
                    });
                })
                .catch((error) => {
                    console.log("Error Adding to Wallet: ", error);
                });
        } else {
            setAlertMsg({
                message: "Not Enouguh Points.",
                severity: "error",
            });
        }

        setOpenClaimModal(false);
        setOpenSnackBar(true);
    };

    const handleCloseSnackBar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpenSnackBar(false);
    };

    const encodeMsg = encodeurl(
        `Wanted to share this with you. Check them out. ${
            business
                ? business.businessName +
                  ": http://localhost:3000/shops/" +
                  shopId
                : "undefined"
        }/${userState.userId}`
    );
    const smsMessage =
        platform.macos || platform.ios
            ? `sms:&body=${encodeMsg}`
            : `sms:?body=${encodeMsg}`;

    const handlePostComment = (event) => {
        event.preventDefault();

        db.collection("shops")
            .doc(shopId)
            .update({
                comments: firebase.firestore.FieldValue.arrayUnion({
                    comment: comment,
                    displayName: userState.displayName,
                }),
            })
            .then(() => {
                console.log("Successfully Adding Comment to Business");

                setComment([]);
            })
            .catch((error) => {
                console.log("Error Adding Comment to Business: ", error);
            });
    };

    const handleFollow = () => {
        db.collection("user")
            .doc(userState.userId)
            .update({
                followingBusinesses:
                    firebase.firestore.FieldValue.arrayUnion(shopId),
            })
            .then(() => {
                console.log(
                    "Successfully Added Business to User FollowingBusinesses"
                );
            })
            .catch((error) => {
                console.log(
                    "Error Adding Business to User FollowingBusinesses: ",
                    error
                );
            });

        db.collection("shops")
            .doc(shopId)
            .update({
                followers: firebase.firestore.FieldValue.arrayUnion(
                    userState.userId
                ),
            })
            .then(() => {
                console.log(
                    "Successfully Added User to Business Info Followers Array"
                );
            })
            .catch((error) => {
                console.log(
                    "Error Added User to Business Info Followers Array: ",
                    error
                );
            });
    };

    const handleUnFollow = () => {
        db.collection("user")
            .doc(userState.userId)
            .update({
                followingBusinesses:
                    firebase.firestore.FieldValue.arrayRemove(shopId),
            })
            .then(() => {
                console.log(
                    "Successfully Added Business to User FollowingBusinesses"
                );
            })
            .catch((error) => {
                console.log(
                    "Error Adding Business to User FollowingBusinesses: ",
                    error
                );
            });

        db.collection("shops")
            .doc(shopId)
            .update({
                followers: firebase.firestore.FieldValue.arrayRemove(
                    userState.userId
                ),
            })
            .then(() => {
                console.log(
                    "Successfully Added User to Business Info Followers Array"
                );
            })
            .catch((error) => {
                console.log(
                    "Error Added User to Business Info Followers Array: ",
                    error
                );
            });
    };

    /**
     * START UseEffects
     */

    useEffect(() => {
        db.collection("shops")
            .doc(shopId)
            .get()
            .then((doc) => {
                setBusiness({
                    shopId: shopId,
                    ...doc.data(),
                });
            })
            .catch((error) => {
                console.log("Error geting business info: ", error);
            });
    }, []);

    useEffect(() => {
        db.collection("shops")
            .doc(shopId)
            .collection("prizes")
            .where("incentive", "==", true)
            .get()
            .then((querySnapshot) => {
                setPrizes(
                    querySnapshot.docs.map((doc) => ({
                        prizeId: doc.id,
                        prize: doc.data(),
                    }))
                );
            })
            .catch((err) => {
                console.log("Error getting Prizes: ", err);
            });

        // if User is Logged in, Get All Biz relationships
        if (userState.userId) {
            db.collection("user")
                .doc(userState.userId)
                .collection("bizRelationships")
                .get()
                .then((querySnapshot) => {
                    setAllBizRelationships(
                        querySnapshot.docs.map((doc) => doc.id)
                    );
                })
                .catch((error) => {
                    console.log("Error All Business Relationships: ", error);
                });
        }
    }, []);

    /**
     * END UseEffects
     */

    console.log("Business at Shop page: ", business);
    console.log("All Business Relationships: ", allBizRelationships);
    // console.log("UserBizRelationship at shop: ", userBizRelationship);

    if (!business) {
        return <div>...Loading Shop</div>;
    }

    return (
        <div className="container">
            <Card sx={{ maxWidth: 345 }}>
                <CardHeader
                    avatar={
                        <Avatar
                            loading="lazy"
                            alt={business.businessName}
                            src={business.logoUrl}
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
                    title={business.businessName}
                    subheader={`${business.address}, ${business.city} ${business.state}`}
                />
                <CardContent>
                    <YouTubeEmbed youtubeId={business.youtubeId} />
                    <div className="actions__bar">
                        <div className="actions__wrapper">
                            <LikeAction
                                userId={userState.userId}
                                shopId={shopId}
                                likedShop={business.likes.includes(
                                    userState.userId
                                )}
                                totalLikes={business.likes.length}
                            />
                            <ChatBubbleOutlineIcon
                                className="chatBubble-btn"
                                onClick={handleCommentFocus}
                            />
                            <div className="likes-followers__wrapper">
                                {" "}
                                {business.followers.length === 1
                                    ? `${business.followers.length} follower`
                                    : `${business.followers.length} followers`}{" "}
                                |{" "}
                                {business.likes.length === 1
                                    ? `${business.likes.length} like`
                                    : `${business.likes.length} likes`}{" "}
                            </div>
                        </div>
                        <div>
                            {userState.userId ? (
                                !userState.followingBusinesses.includes(
                                    shopId
                                ) ? (
                                    <div
                                        className="follow-btn"
                                        onClick={handleFollow}
                                    >
                                        <AddIcon /> Follow
                                    </div>
                                ) : (
                                    <div
                                        className="follow-btn"
                                        onClick={handleUnFollow}
                                    >
                                        <RemoveIcon /> UnFollow
                                    </div>
                                )
                            ) : (
                                <Link
                                    to="/login"
                                    style={{ textDecoration: "none" }}
                                >
                                    <div className="follow-btn">
                                        <LoginIcon />
                                        &nbsp;&nbsp;Login
                                    </div>
                                </Link>
                            )}
                        </div>
                    </div>
                    <Divider />
                    <h3>About Us </h3>

                    <div className="business-description">
                        {business.aboutUs}
                    </div>

                    <h3>Free Prizes 4 First Timers </h3>
                    <AvailablePrizes
                        prizes={prizes}
                        handleOpenClaimModal={handleOpenClaimModal}
                        shopId={shopId}
                        handleOpenShareModal={handleOpenShareModal}
                    />

                    <div className="shop__comments">
                        <small>Latest Reviews:</small>
                        {business.comments.map((comment, index) => (
                            <p key={index}>
                                <strong>{comment.username}</strong>{" "}
                                {comment.comment}
                            </p>
                        ))}
                    </div>

                    {userState.userId && (
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

            <Modal
                open={openClaimModal}
                onClose={handleCloseClaimModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <h4>
                        Congratulations!! Click Claim Button Below to Add this
                        Prize to Your Wallet.
                    </h4>

                    <div className="modal-box__btn-wrapper">
                        <div className="claim__btn" onClick={handleAddToWallet}>
                            Add to Wallet
                        </div>
                        <div
                            className="cancel__btn"
                            onClick={handleCloseClaimModal}
                        >
                            Cancel
                        </div>
                    </div>
                </Box>
            </Modal>

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
                                // url: `https://smartseedtech.com/${shopId}`, // (defaults to current url)
                                url: "https://www.chickenshacknyc.com/",
                                description: `Business Name: ${business.businessName}`, // (defaults to og:description or twitter:description)
                                title: `Business Name: ${business.businessName}`, // (defaults to og:title or twitter:title)
                                message: `Business Name: ${business.businessName}`, // (only for email sharing)
                                subject: `Business Name: ${business.businessName}`, // (only for email sharing)
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

            <Stack spacing={2} sx={{ width: "100%" }}>
                <Snackbar
                    open={openSnackBar}
                    autoHideDuration={3000}
                    onClose={handleCloseSnackBar}
                >
                    <Alert
                        onClose={handleCloseSnackBar}
                        severity={alertMsg.severity}
                        sx={{ width: "100%" }}
                    >
                        {alertMsg.message}
                    </Alert>
                </Snackbar>
            </Stack>
        </div>
    );
}

export default Shop;
