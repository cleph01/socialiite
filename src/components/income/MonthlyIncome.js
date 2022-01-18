import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import OnboardedList from "./OnboardedList";
import Skeleton from "@mui/material/Skeleton";

import { db, firebase } from "../../services/firebase/firebase-config";

import "../../lib/scss/components/income/monthly-income.scss";

function MonthlyIncome() {
    const [onboardedBusinesses, setOnboardedBusinesses] = useState();
    const { authUser } = useContext(UserContext);

    useEffect(() => {
        db.collection("shops")
            .where("salespersonId", "==", authUser.uid)
            .get()
            .then((querySnapshot) => {
                setOnboardedBusinesses(
                    querySnapshot.docs.map((doc) => ({
                        businessId: doc.id,
                        ...doc.data(),
                    }))
                );
            })
            .catch((error) => {
                console.log("Error GEtting Onboarded Businesses: ", error);
            });
    }, []);

    console.log("Onboarded Businesses: ", onboardedBusinesses);

    if (!onboardedBusinesses) {
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
        <div className="monthly-income-container">
            <h4 className="section center">Monthly Income</h4>
            <div className="section center">
                ${50 * onboardedBusinesses.length}.00
            </div>

            <OnboardedList onboardedBusinesses={onboardedBusinesses} />
        </div>
    );
}

export default MonthlyIncome;
