import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import "../../lib/scss/components/hero/circle-menu.scss";

import logo from "../../assets/images/logos/flame-only-logo.png";

function CircleMenu() {
    const history = useHistory();

    useEffect(() => {
        var items = document.querySelectorAll(".circle span");

        for (var i = 0, l = items.length; i < l; i++) {
            items[i].style.left =
                (
                    45 -
                    35 * Math.cos(-0.5 * Math.PI - 2 * (1 / l) * i * Math.PI)
                ).toFixed(4) + "%";

            items[i].style.top =
                (
                    45 +
                    35 * Math.sin(-0.5 * Math.PI - 2 * (1 / l) * i * Math.PI)
                ).toFixed(4) + "%";
        }
    }, []);

    const handleMenuClick = (e) => {
        e.preventDefault();
        document.querySelector(".circle").classList.toggle("open");
    };

    return (
        <nav className="circular-menu">
            <div className="circle open">
                <span
                    className="link"
                    style={{
                        fontSize: "38px",
                        background: "#87ceeb",
                        opacity: "0.75",
                    }}
                    onClick={() => {
                        history.push("/hero/wallet");
                    }}
                >
                    💵
                </span>
                <span
                    className="link"
                    style={{
                        fontSize: "33px",
                        background: "#87ceeb",
                        opacity: "0.75",
                    }}
                    onClick={() => {
                        history.push("/hero/shoutouts");
                    }}
                >
                    📣
                </span>

                <span
                    className="link"
                    style={{
                        fontSize: "33px",
                        background: "#87ceeb",
                        opacity: "0.75",
                    }}
                    onClick={() => {
                        history.push("/hero/upload");
                    }}
                >
                    🎬
                </span>
                <span
                    className="link"
                    style={{
                        fontSize: "33px",
                        background: "#87ceeb",
                        opacity: "0.75",
                    }}
                    onClick={() => {
                        history.push("/hero/trades");
                    }}
                >
                    🤝
                </span>

                <span
                    className="link"
                    style={{
                        fontSize: "33px",
                        background: "#87ceeb",
                        opacity: "0.75",
                    }}
                    onClick={() => {
                        history.push("/hero/wallet");
                    }}
                >
                    🔍
                </span>

                <span
                    className="link"
                    style={{
                        fontSize: "28px",
                        background: "#87ceeb",
                        opacity: "0.75",
                    }}
                    onClick={() => {
                        history.push("/hero/notifications");
                    }}
                >
                    🔔
                </span>
                <span
                    className="link"
                    style={{
                        fontSize: "23px",
                        background: "#87ceeb",
                        opacity: "0.75",
                    }}
                    onClick={() => {
                        history.push("/hero/partner-shops");
                    }}
                >
                    🤜🤛
                </span>
                <div className="menu-button">
                    <img src={logo} style={{ width: "75px", height: "auto" }} />
                </div>
            </div>
        </nav>
    );
}

export default CircleMenu;
