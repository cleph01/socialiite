const UserReducer = (state, action) => {
    switch (action.type) {
        case "USER/CREATE_NEW_USER":
            console.log("Create New User");

            return {
                ...state,
                userId: action.payload.userId,
                displayName: action.payload.displayName,
                avatarUrl: action.payload.avatarUrl,
                seller: false,
                email: action.payload.email,
                phoneNumber: action.payload.phoneNumber,
                timestamp: action.payload.timestamp,
                aboutMe: action.payload.aboutMe,
                followers: [],
                followingBusinesses: [],
                followingFriends: [],
                referrerId: action.payload.referrerId,
            };

        case "USER/SET_EXISTING_USER":
            console.log("Setting Existing Details: ", action.payload);

            return {
                ...state,
                userId: action.payload.userId,
                displayName: action.payload.displayName,
                avatarUrl: action.payload.avatarUrl,
                seller: action.payload.seller,
                aboutMe: action.payload.aboutMe,
                email: action.payload.email,
                timestamp: action.payload.timestamp,
                socials: action.payload.socials,
                followersFriends: action.payload.followersFriends,
                followingFriends: action.payload.followingFriends,
                followingBusinesses: action.payload.followingBusinesses,
            };

        case "AUTH/LOGOUT":
            return {
                isAuthenticated: false,
            };

        default:
            return state;
    }
};

export default UserReducer;
