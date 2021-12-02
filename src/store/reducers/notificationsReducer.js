const NotificationsReducer = (state, action) => {
    switch (action.type) {
        case "NOTIFICATION/ADD_NEW_TRADES":
            console.log("Create New User");

            return {
                ...state,
                trades: action.payload,
            };

        default:
            return state;
    }
};

export default NotificationsReducer;
