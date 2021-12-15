/**
 *  Auth Routes
 *  Public
 */
// Display a Publics Facing Home Page
const HOME = "/";
// Display the Login Page
const LOGIN = "/login/:referrerId?";

/**
 *  User Profile
 *  Private
 */
// Display Current User Profile Details
const MY_PROFILE = "/hero";
// Display Other User Profile Details
const USER_PROFILE = "/user/:otherUserId";

/**
 *  Shoutout Post
 *
 */

// Display posts from other SM platforms according to Hash Tag
const HOT_SPOT = "/hotspot/:businessId";
/**
 *  Digital Wallet Routes
 *  Private
 */
// Display User's Digital Wallet
const WALLET = "/wallet";

/**
 *  Trade Room
 */
const TRADE = "/trade";

/**
 *  Shops Community
 *  Public Routes
 */
// Display All Shops on Socialiite
const SHOPS = "/shops/all";
// Shop Profile Page - Allow for Referrer Tracking When CTA Follow
const SHOP = "/shops/:businessId/:referrerId?";

/**
 *  Store QR Code Routes
 *  Public Routes
 */
// Display QR Code on Store tablet
const STORE = "/store/:businessId";
// Display the Checkin Page after QR code Scan
const CHECKIN = "/checkin/:businessId";

export {
    HOME,
    LOGIN,
    MY_PROFILE,
    USER_PROFILE,
    WALLET,
    TRADE,
    HOT_SPOT,
    SHOPS,
    SHOP,
    STORE,
    CHECKIN,
};
