import { Redirect } from "react-router";
import { Route } from "react-router-dom";

function IsUserLoggedIn({ authUser, loggedInPath, children, ...rest }) {
    return (
        <Route
            exact
            {...rest}
            render={({ location }) => {
                return !!!authUser ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: loggedInPath,
                            state: { from: location },
                        }}
                    />
                );
            }}
        />
    );
}

export default IsUserLoggedIn;
