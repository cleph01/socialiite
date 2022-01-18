import React from "react";

import NavBar from "../components/NavBar";
import MonthlyIncome from "../components/income/MonthlyIncome";
import ReferralIncome from "../components/income/ReferralIncome";

function Income() {
    return (
        <>
            <NavBar />
            <div>
                <MonthlyIncome />
                <ReferralIncome />
            </div>
        </>
    );
}

export default Income;
