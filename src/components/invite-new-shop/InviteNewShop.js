import { useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import platform from "platform-detect/os.mjs";
import encodeurl from "encodeurl";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import ForumIcon from "@mui/icons-material/Forum";

import logo from "../../assets/images/logos/logo_white_text.png";

import "../../lib/scss/components/invite-new-shop/invite-new-shop.scss";
function InviteNewShop() {
    const { authUser } = useContext(UserContext);

    const history = useHistory();

    const encodeMsg = encodeurl(
        `Wanted to share this with you. It turns your customers into your best marketers and spread the word about your business to their friends and family all over social media. Check them out. https://socialiite.web.app/onboard/${authUser.uid}`
    );

    const smsMessage =
        platform.macos || platform.ios
            ? `sms:&body=${encodeMsg}`
            : `sms:?body=${encodeMsg}`;

    return (
        <div className="invite-shop-container">
            <Card className="invite-shop-wrapper">
                <CardContent>
                    <div className="invite-shop-header">
                        <div className="img-wrapper">
                            <img
                                alt="socialiite logo"
                                src={logo}
                                style={{ width: "75px", height: "auto" }}
                            />
                        </div>
                        <h3>
                            Your Mission <br /> Should You Choose to Accept It
                        </h3>
                    </div>
                    <div className="mission-emoji">✨ 💪😎👍 ✨</div>
                    <div className="invite-shop-cta-wrapper">
                        <div className="invite-shop-cta-words">
                            Share This to Start Getting Paid Monthly
                        </div>
                        <div className="invite-shop-cta-emoji">👉</div>
                        <div className="invite-shop-cta-icon"></div>
                        <a href={smsMessage}>
                            <ForumIcon
                                sx={{
                                    color: "#1c76d2",
                                    fontSize: "52px",
                                }}
                            />
                        </a>
                    </div>
                    <div className="invite-shop-body">
                        <p>
                            Socialiite's mission is to help put economic power
                            back in the hands of the people.
                        </p>
                        <p>
                            Other social media platforms profit from your
                            content.
                        </p>
                        <p>
                            You make the content, they own it, and profit from
                            your work.
                        </p>
                        <p>Socialiite allows you to create the same content.</p>
                        <p> But now you're going to be paid for it</p>
                        <p>Creating content is a form of expresion.</p>
                        <p>
                            We tell the world what's on our minds, where we are,
                            what we're eating, wearing, jamming to
                        </p>
                        <p>We are being Socialiites 🙌</p>
                        <p>We are ALL influencers to a very real extent.</p>
                        <p>
                            We have friends and family who value our opinion,
                            style, and tastes.
                        </p>
                        <p>
                            Take back your economic power, promote yourself and
                            the businesses you support AND FINALLY get paid for
                            it.
                        </p>
                        <p>
                            All your content is uploaded to YOUR YouTube helping
                            you build your personal brand while also helping the
                            business you care about.
                        </p>
                        <h3>It's a Win-Win</h3>
                        <p>
                            Invite another business or List your side--hustle on
                            Socialiite so that other Socialiites can promote you
                            or that business and get paid for doing so.
                        </p>
                        <p>
                            Socialiite tracks how many customers you've brought
                            into the business.
                        </p>
                        <p>
                            For a business to be on Socialiite, they must agree
                            to pay you for bringing in new business.
                        </p>
                        <p>
                            ... in addition to offering FREE incentives for the
                            new customers you bring in.
                        </p>
                        <p>
                            {" "}
                            PLUS, they must offer prizes for repeat business.
                        </p>{" "}
                        <p className="invite-shop-fire-emoji">🔥🔥🔥</p>
                        <p>You can get paid out in USD or ETH.</p>
                    </div>
                    <div
                        className="invite-shop-close-btn"
                        onClick={() => history.push("/hero")}
                    >
                        Close
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default InviteNewShop;
