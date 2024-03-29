import { lazy } from "react";

// Auth
const Home = lazy(() => import("../pages/Home.js"));
const Login = lazy(() => import("../pages/Login.js"));

// Privacy Policy
const Privacy = lazy(() => import("../pages/PrivacyPolicy.js"));

// Onboard Business
const Onboard = lazy(() => import("../pages/OnboardBusiness.js"));

// Income Page
const Income = lazy(() => import("../pages/Income.js"));

// user Profile
const MyProfile = lazy(() => import("../pages/Hero"));
// const UserProfile = lazy(() => import("../pages/my_profile/UserProfile.js"));
// const EditProfile = lazy(() => import("../pages/edit_profile/EditProfile.js"));

// Shoutout Posts
const Shoutout = lazy(() => import("../pages/Shoutout.js"));
// const NewPost = lazy(() => import("../pages/post/AddPost.js"));
// const Post = lazy(() => import("../pages/post/Post.js"));

const HotSpot = lazy(() => import("../pages/HotSpot.js"));

// Digital Wallet
// const Wallet = lazy(() => import("../pages/wallet/Wallet.js"));

// Shops Directory
// const AllShops = lazy(() => import("../pages/AllShops.js"));
const Shop = lazy(() => import("../pages/Shop.js"));

// QR / Checkin
const Store = lazy(() => import("../pages/Store.js"));
const Checkin = lazy(() => import("../pages/CheckIn.js"));

// Trade Room
const Trade = lazy(() => import("../pages/Trade.js"));
// Shop Related
// const MyShop = lazy(() => import("../pages/MyShop.js"));
// const NewShop = lazy(() => import("../pages/NewShop.js"));
// const EditShop = lazy(() => import("../pages/shops/EditShop.js"));
// const NewPrize = lazy(() =>
//     import("../pages/loyalty_prize/NewLoyaltyPrize.js")
// );
// const EditPrize = lazy(() =>
//     import("../pages/loyalty_prize/EditLoyaltyPrize.js")
// );

// Not Found
const NotFound = lazy(() => import("../pages/NotFound.js"));

// const NewProduct = lazy(() => import("../pages/NewProduct.js"));
// const Market = lazy(() => import("../pages/Market.js"));
// const Product = lazy(() => import("../pages/Product.js"));
// const Auction = lazy(() => import("../components/auction/FeaturedAuction.js"));
// const Auctions = lazy(() => import("../pages/Auctions.js"));

// const EditProduct = lazy(() => import("../pages/EditProduct.js"));

export {
    Home,
    Login,
    Privacy,
    Onboard,
    Income,
    MyProfile,
    HotSpot,
    Shoutout,
    Shop,
    Store,
    Checkin,
    Trade,
    NotFound,
};
