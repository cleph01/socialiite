import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { useParams, Redirect } from "react-router-dom";
import CheckinAuth from "../../components/auth/Auth";

import "../../lib/scss/components/checkin/process-checkin.scss";

function ProcessAuth() {
    const { businessId } = useParams();
    const { authUser } = useContext(UserContext);

    if (authUser) {
        return <Redirect to={`/checkin/${businessId}/process`} />;
    }

    return (
        <div
            className="process-checkin__container"
            style={{ visibility: authUser ? "hidden" : "" }}
        >
            <div className="process-checkin__wrapper">
                <h3 className="process-checkin__header">Sign In to Continue</h3>
                <CheckinAuth
                    redirectPath={`/checkin/${businessId}/verify-location`}
                />
            </div>
        </div>
    );
}

export default ProcessAuth;
