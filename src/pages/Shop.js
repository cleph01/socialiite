import { useState, useEffect, useContext, forwardRef, useRef } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import PhoneIcon from "@mui/icons-material/Phone";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";

import Skeleton from "@mui/material/Skeleton";

import NavBar from "../components/NavBar";
import ActionsBar from "../components/shops/ActionsBar";
import Comments from "../components/shops/Comments";
import AvailablePrizes from "../components/shops/AvailablePrizes";

import IconButton from "@mui/material/IconButton";

import ClaimModal from "../components/modals/claim-modal/ClaimModal";
import ShareModal from "../components/modals/share-modal/ShareModal";

import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import "../lib/scss/pages/shop.scss";

import { firebase, db } from "../services/firebase/firebase-config";

function Shop() {
    const commentRef = useRef();

    const { authUser, userState } = useContext(UserContext);
    const { businessId } = useParams();
    const [business, setBusiness] = useState();

    const [userBizRelationship, setUserBizRelationship] = useState(null);

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
        if (!authUser) {
            setAlertMsg({
                message: "Please Login First",
                severity: "error",
            });

            setOpenSnackBar(true);
        } else if (userBizRelationship && itemObj.prize.incentive) {
            setAlertMsg({
                message: "Prize is for New Customers Only",
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
        if (!authUser) {
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

    const handleCloseSnackBar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpenSnackBar(false);
    };

    const handlePostComment = (event) => {
        event.preventDefault();

        db.collection("shops")
            .doc(businessId)
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
        db.collection("shops")
            .doc(businessId)
            .get()
            .then((doc) => {
                console.log("Que biz: ", doc);
                setBusiness({
                    businessId: businessId,
                    ...doc.data(),
                });
            })
            .catch((error) => {
                console.log("Error geting business info: ", error);
            });
    }, [businessId]);

    useEffect(() => {
        // if User is Logged in, Check if Biz relationship exists
        if (authUser) {
            db.collection("users")
                .doc(authUser.uid)
                .collection("bizRelationships")
                .doc(businessId)
                .get()
                .then((doc) => {
                    if (doc.exists) {
                        setUserBizRelationship(doc.data());
                    }
                })
                .catch((error) => {
                    console.log(
                        "Error Getting Business Relationships: ",
                        error
                    );
                });
        }
    }, []);

    /**
     * END UseEffects
     */

    console.log("Business at Shop page: ", business);
    console.log("User Business Relationship: ", userBizRelationship);
    console.log("User State at shop: ", userState);

    if (!business) {
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
                    action={
                        <a
                            href={`tel:${business.phone}`}
                            style={{ textDecoration: "none" }}
                        >
                            <IconButton aria-label="settings">
                                <PhoneIcon />
                            </IconButton>
                        </a>
                    }
                    title={business.businessName}
                    subheader={`${business.address}, ${business.city} ${business.state}`}
                />
                <CardContent>
                    <div
                        className="video"
                        style={{
                            position: "relative",
                            paddingBottom: "56.25%" /* 16:9 */,
                            paddingTop: 25,
                            height: 0,
                        }}
                    >
                        <iframe
                            title="YouTube Socialiite Shoutout"
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                            }}
                            src={`https://www.youtube.com/embed/${business.youtubeId}?autoplay=1`}
                            frameBorder="0"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                        />
                    </div>
                    <ActionsBar
                        business={business}
                        handleCommentFocus={handleCommentFocus}
                        setBusiness={setBusiness}
                    />
                    <Divider />
                    <h3>About Us </h3>

                    <div className="business-description">
                        {business.aboutUs}
                    </div>

                    <h3>Available Prizes</h3>
                    <AvailablePrizes
                        businessId={businessId}
                        handleOpenClaimModal={handleOpenClaimModal}
                    />

                    <div className="shop__comments">
                        <Comments
                            businessId={businessId}
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

            <ClaimModal
                openClaimModal={openClaimModal}
                handleCloseClaimModal={handleCloseClaimModal}
                walletPrize={walletPrize}
                userBizRelationship={userBizRelationship}
                setUserBizRelationship={setUserBizRelationship}
                business={business}
                setAlertMsg={setAlertMsg}
                setOpenClaimModal={setOpenClaimModal}
                setOpenSnackBar={setOpenSnackBar}
            />

            <ShareModal
                openShareModal={openShareModal}
                handleCloseShareModal={handleCloseShareModal}
            />

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
