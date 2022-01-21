import React from "react";
import { Link, useHistory } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import "../../lib/scss/components/my-shops/shop-list.scss";

function Shop({ shops }) {
    const history = useHistory();

    return (
        <List className="my-shop-list-container">
            {shops.map((shop, i) => (
                <div key={i}>
                    <Divider />
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar src={shop.logoUrl} />
                        </ListItemAvatar>

                        <Typography
                            type="headline"
                            component="h2"
                            color="primary"
                            className="shop-list-business-name"
                        >
                            {shop.businessName}
                        </Typography>

                        <ListItemSecondaryAction className="list-icons-wrapper">
                            <EditIcon
                                className="list-icons"
                                onClick={() =>
                                    history.push(
                                        `/hero/my-shops/edit/${shop.businessId}`
                                    )
                                }
                            />
                            <DeleteForeverIcon className="list-icons" />
                        </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                </div>
            ))}
        </List>
    );
}

export default Shop;
