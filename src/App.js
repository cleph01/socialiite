import { lazy, Suspense, useReducer, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import useAuthListener from "./hooks/use-auth-listener";

import { UserContext } from "./contexts/UserContext";
import UserReducer from "./store/reducers/userReducer.js";

import Skeleton from "@mui/material/Skeleton";

import * as ROUTES from "./routing/routes";
import * as COMPONENTS from "./routing/routeComponents";
import Hero from "./pages/Hero";
import PrivateRoute from "./routing/PrivateRoute";
import IsUserLoggedIn from "./routing/IsUserLoggedIn";

import "./App.css";

const initialState = {
    displayName: null,
    avatarUrl: null,
    seller: null,
    email: null,
    phoneNumber: null,
    timestamp: null,
    aboutMe: null,
    socials: {},
    followingFriends: null,
    followersFriends: null,
    followingBusinesses: null,
    userId: null,
};

function App() {
    const [userState, userDispatch] = useReducer(UserReducer, initialState);

    const { authUser } = useAuthListener();

    return (
        <div className="App">
            <UserContext.Provider value={{ userState, userDispatch }}>
                <Router>
                    <Suspense
                        fallback={
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginTop: "10px",
                                }}
                            >
                                <Skeleton
                                    variant="rectangular"
                                    width={350}
                                    height={218}
                                />
                            </div>
                        }
                    >
                        <Switch>
                            <IsUserLoggedIn
                                authUser={authUser}
                                path={ROUTES.LOGIN}
                                loggedInPath={ROUTES.MY_PROFILE}
                            >
                                <COMPONENTS.Login />
                            </IsUserLoggedIn>

                            <PrivateRoute
                                path={ROUTES.MY_PROFILE}
                                authUser={authUser}
                            >
                                <COMPONENTS.MyProfile />
                            </PrivateRoute>

                            {/* <Route
                                path="/hero"
                                component={COMPONENTS.MyProfile}
                                authUser={authUser}
                            /> */}

                            <Route exact path="/" component={COMPONENTS.Home} />

                            <Route>
                                <COMPONENTS.NotFound />
                            </Route>
                        </Switch>
                    </Suspense>
                </Router>
            </UserContext.Provider>
        </div>
    );
}

export default App;
