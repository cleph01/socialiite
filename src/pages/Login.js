import { useState, useContext, forwardRef } from "react";

import { Redirect } from "react-router";

import { useParams } from "react-router-dom";

import Auth from "../components/auth/Auth";

import { UserContext } from "../contexts/UserContext";

import "../lib/scss/pages/login.scss";

import logo from "../assets/images/logos/logo.png";

function Login() {
    const { referrerId } = useParams();

    console.log("ReferrerId in Login: ", referrerId);
    console.log("Storage: ", localStorage.getItem("redirectPath"));

    return (
        <>
            <div className="login__container">
                <div className="login__wrapper">
                    <div className="image__wrapper">
                        <img className="logo" src={logo} alt="logo" />
                    </div>

                    <h3>
                        <center>
                            Win Stuff, Trade Stuff, Share Stuff <br />
                            and
                            <span style={{ fontSize: "28px" }}> Get Paid</span>
                        </center>
                    </h3>

                    <Auth referrerId={referrerId} redirectPath="/hero" />
                </div>
            </div>
        </>
    );
}

export default Login;
