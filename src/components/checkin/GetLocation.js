import React from "react";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import "../../lib/scss/components/checkin/get-location.scss";

function GetLocation({ handleGeoLocation, goStatus }) {
    return (
        <div className="geolocation-container">
            <h3 className="geolocation-header">
                <center>
                    Please Confirm Your Location <br /> To Check-In
                </center>
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
                    <CircularProgress />
                ) : (
                    "Get Geolocation"
                )}
            </div>
        </div>
    );
}

export default GetLocation;
