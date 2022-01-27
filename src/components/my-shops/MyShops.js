import React, {
    useState,
    Suspense,
    useEffect,
    useContext,
    forwardRef,
} from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import Card from "@mui/material/Card";

import CardContent from "@mui/material/CardContent";

import AddBoxIcon from "@mui/icons-material/AddBox";
import Avatar from "@mui/material/Avatar";

import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import "../../lib/scss/components/my-shops/my-shop.scss";

import { db, firebase } from "../../services/firebase/firebase-config";

import Shops from "./Shops";
import DeleteShopModal from "../modals/delete-modals/DeleteShopModal";

function MyShops() {
    const history = useHistory();
    const { userState, authUser } = useContext(UserContext);
    const [shops, setShops] = useState([]);
    const [deleteBusiness, setDeleteBusiness] = useState();
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const [alertMsg, setAlertMsg] = useState({
        message: "",
        severity: "",
    });

    const [openSnackBar, setOpenSnackBar] = useState(false);

    const Alert = forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const handleCloseSnackBar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpenSnackBar(false);
    };

    const sendToCustomerPortal = () => {
        window.location.assign(userState.stripeLink);
    };

    useEffect(() => {
        db.collection("shops")
            .where("ownerId", "==", authUser.uid)
            .get()
            .then((querySnapshot) => {
                if (querySnapshot.docs.length > 0) {
                    setShops(
                        querySnapshot.docs.map((doc) => ({
                            businessId: doc.id,
                            ...doc.data(),
                        }))
                    );
                }
            })
            .catch((error) => {
                console.log("Error Getting My Shops: ", error);
            });
    }, []);

    console.log("UserState in myShops: ", userState);

    return (
        <div className="shop-container">
            <Card className="shop-wrapper">
                <CardContent>
                    <div className="shop-header">
                        <h3>Your Shops</h3>
                        <div
                            className="billing-btn"
                            onClick={sendToCustomerPortal}
                        >
                            Billing
                        </div>
                        <Link to="/hero/my-shops/new">
                            <div className="add-shop-btn">
                                <AddBoxIcon />
                                New Shop
                            </div>
                        </Link>
                    </div>
                    <Suspense fallback={<div>Loading...</div>}>
                        <Shops
                            shops={shops}
                            setDeleteBusiness={setDeleteBusiness}
                            setOpenDeleteModal={setOpenDeleteModal}
                        />
                    </Suspense>
                </CardContent>
            </Card>

            <DeleteShopModal
                openDeleteModal={openDeleteModal}
                deleteBusiness={deleteBusiness}
                setShops={setShops}
                setOpenDeleteModal={setOpenDeleteModal}
                setAlertMsg={setAlertMsg}
                setOpenSnackBar={setOpenSnackBar}
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

export default MyShops;
