/**
 *  Auth Routes
 *  Public
 */
// Display a Publics Facing Home Page
const HOME = "/";
// Display the Login Page
const LOGIN = "/login/:referrerId?";

/**
 * Dashboard Routes
 * Private
 */
// Display User Dasboard
const DASHBOARD = "/dashboard/:userId";

/**
 *  User Profile
 *  Private
 */
// Display Current User Profile Details
const MY_PROFILE = "/hero";
// Display Other User Profile Details
const USER_PROFILE = "/user/:otherUserId";

// Edit User Profile Details
const EDIT_PROFILE = "/profile/edit/"; // Private Route

/**
 *  Shoutout Posts
 *  Private
 */
// Add New Post
const NEW_POST = "/post/:userId/new";
// Display Post by PostId
const POST = "/post/:userId/:postId";
// Display All Posts by a specific User
const USER_POSTS = "/posts/:userId";
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

/**
 *  User Ownerd Shop Routes
 *  Private Routes
 */
// Display All User Owned Shops
const MY_SHOPS = "/seller/shops"; // private route
// Add New Shop to Owner's Shop List
const NEW_SHOP = "/seller/shop/new"; // private route"
// Edit Existhing Shop Profile Details
const EDIT_SHOP = "/seller/shop/edit/:businessId"; // private route
// Add New Loyalty Prize
const NEW_PRIZE = "/seller/:businessId/prizes/new"; // private route
// Edit Existing Loyalty Prize
const EDIT_PRIZE = "/seller/:businessId/:prizeId/edit-prize"; // private route

export {
    HOME,
    LOGIN,
    DASHBOARD,
    MY_PROFILE,
    USER_PROFILE,
    EDIT_PROFILE,
    NEW_POST,
    POST,
    USER_POSTS,
    WALLET,
    TRADE,
    HOT_SPOT,
    SHOPS,
    SHOP,
    STORE,
    CHECKIN,
    MY_SHOPS,
    NEW_SHOP,
    EDIT_SHOP,
    NEW_PRIZE,
    EDIT_PRIZE,
};
