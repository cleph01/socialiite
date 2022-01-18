import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext";
import ReferralList from "./ReferralList";
import Skeleton from "@mui/material/Skeleton";
import "../../lib/scss/components/income/referral-income.scss";

function ReferralIncome() {
    const { userState } = useContext(UserContext);
    const [pendingPayment, setPendingPayment] = useState();

    useEffect(() => {
        if (userState) {
            console.log("User State in Referral Income: ", userState);
            setPendingPayment(
                userState.referrals.filter((item) => item.paid === false)
            );
        }
    }, [userState.referrals]);

    console.log("Pending Payment: ", pendingPayment);

    if (!pendingPayment) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "10px",
                }}
            >
                <Skeleton variant="rectangular" width={350} height={218} />
            </div>
        );
    }

    return (
        <div className="referral-income-container">
            <h4>Referral Income</h4>
            <div className="section center">
                ${50 * pendingPayment.length}.00
            </div>

            <ReferralList referralList={pendingPayment} />
        </div>
    );
}

export default ReferralIncome;
