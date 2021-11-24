import { useEffect, useState } from "react";

import List from "@mui/material/List";

import { db } from "../../firebase/firebase_config";

import Shop from "./components/Shop";

import "./styles/all_shops.scss";

function ShopList() {
    const [shops, setShops] = useState();

    useEffect(() => {
        console.log("Dafuq");
        db.collection("shops")
            .get()
            .then((shops) => {
                console.log("Shops in query: ", shops);
                setShops(
                    shops.docs.map((doc) => ({
                        shopId: doc.id,
                        ...doc.data(),
                    }))
                );
            })
            .catch((error) => {
                console.log("Error GEtting Posts: ", error);
            });
    }, []);

    if (!shops) {
        return <div>...Loading</div>;
    }

    console.log("Shops in Shops: ", shops);
    return (
        <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
            {shops.map((shop, i) => (
                <Shop key={shop.shopId} shop={shop} />
            ))}
        </List>
    );
}

export default ShopList;
