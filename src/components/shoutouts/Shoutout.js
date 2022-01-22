import React from "react";
import { Link } from "react-router-dom";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import LinkIcon from "@mui/icons-material/Link";
import YouTubeEmbed from "./YouTubeEmbed";

const authUser = localStorage.getItem("authUser");

function Shoutout({ item }) {
    return (
        <ImageListItem>
            {item.youtubeId ? (
                <YouTubeEmbed youtubeId={item.post.youtubeId} />
            ) : (
                <img
                    src={`${item.imageUrl}`}
                    srcSet={`${item.imageUrl}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    alt={item.title}
                    loading="lazy"
                />
            )}
            <Link to={`/shoutout/${item.postId}/${item.businessId}`}>
                <ImageListItemBar
                    sx={{ padding: "0px 6px" }}
                    title={`${item.caption.slice(0, 10)}...`}
                    subtitle={item.businessName}
                    position="below"
                    actionIcon={<LinkIcon />}
                />
            </Link>
        </ImageListItem>
    );
}

export default React.memo(Shoutout);
