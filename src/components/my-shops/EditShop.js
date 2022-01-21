import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import NewShopLogoUpload from "../my-shops/NewShopLogoUpload";
import NewPrizeInput from "../my-shops/NewPrizeInput";

import "../../lib/scss/components/my-shops/new-shop.scss";

function EditShop() {
    const history = useHistory();

    const { businessId } = useParams();

    console.log("businessId: ", businessId);

    const [values, setValues] = useState({
        name: "",
        handle: "",
        email: "",
        bio: "",
        open: false,
        error: "",
        redirectToProfile: false,
    });

    const [prizes, setPrizes] = useState([
        { description: "", emoji: "", pointCost: 0, inentive: true },
    ]);

    const [age, setAge] = React.useState(false);

    const appendPrizeField = () => {
        setValues((prevState) => ({ ...prevState, error: "" }));

        setPrizes((prevState) => [
            ...prevState,
            { description: "", emoji: "", pointCost: 0, inentive: true },
        ]);
    };

    const deletePrizeField = (indexPos) => {
        if (prizes.length === 1) {
            setValues((prevState) => ({
                ...prevState,
                error: "Must Have At Least One Prize",
            }));
        } else {
            setPrizes(prizes.filter((item, index) => index !== indexPos));
        }
    };

    const handleAgeChange = (event) => {
        setAge(event.target.value);
    };

    const handleChange = (name) => (event) => {
        setValues({ ...values, [name]: event.target.value });
    };

    console.log("Prizes: ", prizes);

    return (
        <div className="new-shop-container">
            <Card className="card-wrapper">
                <CardContent>
                    <center>
                        <Typography variant="h5">New Shop</Typography>
                        <NewShopLogoUpload />
                        <TextField
                            id="handle"
                            label="Shop Name"
                            value={values.handle}
                            onChange={handleChange("handle")}
                            margin="normal"
                            className="input"
                        />
                        <br />
                        <TextField
                            id="bio"
                            label="Description"
                            value={values.bio}
                            onChange={handleChange("bio")}
                            margin="normal"
                            className="input"
                            multiline
                        />
                        {prizes.map((prize, i) => (
                            <NewPrizeInput
                                key={i}
                                index={i}
                                prize={prize}
                                deletePrizeField={deletePrizeField}
                                age={age}
                            />
                        ))}
                        <br />{" "}
                        {values.error && (
                            <Typography component="p" color="error">
                                {values.error}
                            </Typography>
                        )}
                    </center>
                </CardContent>
                <center>
                    <div className="btn-wrapper">
                        <div
                            className="add-prize-btn"
                            onClick={appendPrizeField}
                        >
                            Add Prize
                        </div>
                        <div className="submit-btn">Submit</div>
                        <div
                            className="cancel-btn"
                            onClick={() => history.push("/hero/my-shops")}
                        >
                            Cancel
                        </div>
                    </div>
                </center>
            </Card>
        </div>
    );
}

export default EditShop;
