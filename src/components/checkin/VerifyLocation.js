import { useState, useContext } from "react";
import { useHistory, Redirect, useParams } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import "../../lib/scss/components/checkin/verify-location.scss";

import { getDistanceBetween } from "geolocation-distance-between";

function VerifyLocation({ business, goStatus, setGoStatus }) {
    const history = useHistory();

    const { businessId } = useParams();

    const [geoDistance, setGeoDistance] = useState();
    const { authUser, userDispatch } = useContext(UserContext);

    const handleGeoLocation = () => {
        setGoStatus({ ...goStatus, fetchingDistance: true });

        if ("geolocation" in navigator) {
            console.log("Available");

            /**
             * Do distance calcs
             */
            navigator.geolocation.getCurrentPosition(function (position) {
                console.log("Latitude is :", position.coords.latitude);
                console.log("Longitude is :", position.coords.longitude);

                let coordinateOne = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };
                let coordinateTwo = {
                    latitude: business.lat,
                    longitude: business.lon,
                };

                let distanceBetween = getDistanceBetween(
                    coordinateOne,
                    coordinateTwo
                );

                console.log("Kilometers: ", distanceBetween);

                setGeoDistance(distanceBetween);
                setGoStatus({
                    ...goStatus,
                    gotDistance: true,
                    fetchingDistance: false,
                });

                userDispatch({
                    type: "USER/SET_GEO_LOCATION",
                    payload: {
                        gotDistance: true,
                        geoDistance: distanceBetween,
                    },
                });

                history.push(`/checkin/${business.businessId}/process`);
            });
        } else {
            console.log("Geolocation Not Available in Your Browser");
        }
    };

    console.log("Authuser at VerifyLocation: ", authUser);
    if (!authUser) {
        return <Redirect to={`/checkin/${businessId}/process`} />;
    }

    return (
        <div className="geolocation-container">
            <h3 className="geolocation-header">
                Please Verify Your Location <br /> To Check-In
            </h3>
            <div
                className="geolocation-button"
                style={{
                    padding: goStatus.fetchingDistance ? "30px 0px" : null,
                }}
                onClick={handleGeoLocation}
            >
                {goStatus.fetchingDistance ? (
                    // <LinearProgress color="success" />
                    <CircularProgress color="inherit" />
                ) : (
                    "Verify Your Location"
                )}
            </div>
        </div>
    );
}

export default VerifyLocation;
