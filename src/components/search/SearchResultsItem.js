import React, { useContext } from "react";
import { Link } from "react-router-dom";

import ListItem from "@mui/material/ListItem";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";

// import "../../lib/scss/components/search/search-result-item.scss";

function SearchResultsItem({ result }) {
    return (
        <Link
            to={`/shops/${result.businessId}`}
            style={{ textDecoration: "none", color: "inherit" }}
        >
            <Divider />
            <ListItem>
                <ListItemAvatar>
                    <Avatar src={result.logoUrl} />
                </ListItemAvatar>
                <div className="bla">
                    <Typography type="headline" component="h2">
                        {result.businessName}
                    </Typography>
                </div>
                <ListItemSecondaryAction
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        width: "60px",
                    }}
                >
                    <div
                        style={{ fontSize: "24px" }}
                        onClick={() => {
                            alert("Clicked");
                        }}
                    >
                        👀
                    </div>
                </ListItemSecondaryAction>
            </ListItem>
            <Divider />
        </Link>
    );
}

export default SearchResultsItem;
