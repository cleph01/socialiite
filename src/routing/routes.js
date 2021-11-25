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
/**
 *  Digital Wallet Routes
 *  Private
 */
// Display User's Digital Wallet
const WALLET = "/wallet";

/**
 *  Shops Community
 *  Public Routes
 */
// Display All Shops on Socialiite
const SHOPS = "/shops/all";
// Shop Profile Page - Allow for Referrer Tracking When CTA Follow
const SHOP = "/shops/:shopId/:referrerId?";

/**
 *  Store QR Code Routes
 *  Public Routes
 */
// Display QR Code on Store tablet
const STORE = "/store/:shopId";
// Display the Checkin Page after QR code Scan
const CHECKIN = "/checkin/:shopId";

/**
 *  User Ownerd Shop Routes
 *  Private Routes
 */
// Display All User Owned Shops
const MY_SHOPS = "/seller/shops"; // private route
// Add New Shop to Owner's Shop List
const NEW_SHOP = "/seller/shop/new"; // private route"
// Edit Existhing Shop Profile Details
const EDIT_SHOP = "/seller/shop/edit/:shopId"; // private route
// Add New Loyalty Prize
const NEW_PRIZE = "/seller/:shopId/prizes/new"; // private route
// Edit Existing Loyalty Prize
const EDIT_PRIZE = "/seller/:shopId/:prizeId/edit-prize"; // private route

// Market
// const MARKET = "/market";

// const CART = "/cart";
// const PRODUCT = "/product/:productId";

// Auction
// const AUCTIONS = "/auctions/all";
// const AUCTION = "/auction/:auctionId";
// const MY_AUCTION = "/myauctions";
// const NEW_AUCTION = "/auction/new";
// const EDIT_AUCTION = "/auction/edit/:auctionId";

// Stripe
// const STRIPE_CONNECT = "/seller/stripe/connect";

// Order
// const ORDER = "/order/:orderId";
// const SHOP_ORDER = "/seller/orders/:shop/:shopId"; //private route

// My Shop
// const NEW_PRODUCT = "/seller/:shopId/products/new"; // private route
// const EDIT_PRODUCT = "/seller/:shopId/:productId/edit"; // private route

// Stripe connect
// const STRIPE = "/seller/stripe/connect";

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
