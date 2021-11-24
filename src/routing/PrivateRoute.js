import React from "react";
import { Redirect } from "react-router";
import { Route } from "react-router-dom";

function PrivateRoute({ children, authUser, ...rest }) {
    console.log("Auth User in Private Route: ", authUser);
    return (
        <Route
            exact
            {...rest}
            render={({ location }) => {
                return !!authUser ? (
                    React.cloneElement(children, { authUser })
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: location },
                        }}
                    />
                );
            }}
        />
    );
}

export default PrivateRoute;
