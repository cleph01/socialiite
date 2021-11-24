import { Route } from "react-router-dom";

import HeroHeader from "../components/hero/HeroHeader";
import Shoutouts from "../components/shoutouts/Shoutouts";
import PartnerShops from "../components/partner-shops/PartnerShops";
import Wallet from "../components/wallet/Wallet";

const user = {
    avartarUrl: "https://www.w3schools.com/howto/img_avatar.png",
    displayName: "charlesmontoya79@gmail.com",
    socials: {
        facebook: "facbook",
        youtube: "youtube",
        instagram: "instagram",
        twitter: "twitter",
        linkedIn: "linkedIn",
        github: "github",
    },
};
function Hero() {
    return (
        <>
            <HeroHeader user={user} />

            <Route path="/hero/shoutouts">
                <Shoutouts />
            </Route>

            <Route path="/hero/partner-shops">
                <PartnerShops />
            </Route>

            <Route path="/hero/wallet">
                <Wallet />
            </Route>
        </>
    );
}

export default Hero;
