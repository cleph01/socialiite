import { useState, useContext, useEffect, forwardRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

import { db, firebase } from "../services/firebase/firebase-config";

import { createCheckoutSession } from "../services/stripe/createCheckoutSession";
import useSellerStatus from "../services/stripe/useSellerStatus";

import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import Auth from "../components/auth/Auth.js";

import "../lib/scss/pages/onboard.scss";

import logo from "../assets/images/logos/logo.png";

function OnboardBusiness() {
    const { authUser } = useContext(UserContext);

    // const authUser = false;

    const { salesPersonId } = useParams();

    const history = useHistory();

    const userIsSeller = useSellerStatus(authUser);

    const [salesPerson, setSalesPerson] = useState();

    const [openSnackBar, setOpenSnackBar] = useState(false);

    const [alertMsg, setAlertMsg] = useState({
        message: "",
        severity: "",
    });

    const handleCloseSnackBar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpenSnackBar(false);
    };

    const Alert = forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const sendToCustomerPortal = () => {
        const functionRef = firebase.default
            .functions()
            .httpsCallable(
                "ext-firestore-stripe-subscriptions-createPortalLink"
            );

        const { data } = functionRef({
            returnUrl: window.location.origin,
        });
        window.location.assign(data.url);
    };

    useEffect(() => {
        localStorage.setItem(
            "redirectPath",
            salesPersonId ? `/onboard/${salesPersonId}` : "/onboard"
        );

        if (salesPersonId) {
            localStorage.setItem("salesPersonId", salesPersonId);
            db.collection("users")
                .doc(salesPersonId)
                .get()
                .then((user) => {
                    // If User exists,
                    //Set User Context with Reducer

                    if (user.exists) {
                        console.log("Salesperson Exists");
                        setSalesPerson(user.data());
                    }
                })
                .catch((error) => {
                    console.log("Error Getting Salesperson: ", error);
                });
        }
    }, []);

    console.log("SalesPersonId: ", salesPersonId);
    return (
        <div className="onboard-container">
            <div className="onboard-wrapper">
                <div className="onboard-logo-wrapper">
                    <img alt="socialiite logo" src={logo} />
                </div>
                <h2>✨ 👋 ✨ </h2>
                <div className="onboard-welcome-header">
                    <p>
                        Hi, &nbsp;
                        <span className="onboard-salesperson-name">
                            {salesPerson?.displayName}
                        </span>{" "}
                        shared our app with you because we are the future of
                        marketing.
                    </p>
                    <p>
                        We are Socialiite. The only Peer-to-Peer marketing
                        platform that turns your cutomers into your best
                        marketers.
                    </p>
                    <p>
                        Our platform allows your customers to promote your
                        business to their friends, family, and anyone else on
                        social media who likes what you make or what you do 🙌
                    </p>
                </div>
                <div className="columns">
                    <ul className="price">
                        <li className="header">Plan</li>
                        <li className="grey">$ 150.00 / month</li>
                        <li>Supercharged Word of Mouths</li>
                        <li>Customers Promote You via Text</li>
                        <li>
                            Customers Advertise for You on their Social Media
                        </li>
                        <li>
                            Unlimited Business Listings for All Your Businesses
                            and Side Hustles
                        </li>
                        <li className="grey">
                            {!authUser ? (
                                <div>
                                    <h5>Signin Below to Continue</h5>
                                    <Auth
                                        redirectPath="/onboard"
                                        referrerId={salesPersonId}
                                    />
                                </div>
                            ) : !userIsSeller ? (
                                <div
                                    className="button"
                                    onClick={() =>
                                        createCheckoutSession(authUser.uid)
                                    }
                                >
                                    Proceed to Checkout
                                </div>
                            ) : (
                                <div
                                    className="button"
                                    style={{ disabled: true }}
                                    onClick={() =>
                                        history.push("/hero/my-shops")
                                    }
                                >
                                    Manage Your Businesses
                                </div>
                            )}
                        </li>
                    </ul>
                </div>
            </div>

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

export default OnboardBusiness;
