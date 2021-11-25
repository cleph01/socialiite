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
            {item.post.youtubeId ? (
                <YouTubeEmbed youtubeId={item.post.youtubeId} />
            ) : (
                <img
                    src={`${item.post.imageUrl}`}
                    srcSet={`${item.post.imageUrl}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    alt={item.post.title}
                    loading="lazy"
                />
            )}
            <Link to={`/post/${authUser.uid}/${item.postId}`}>
                <ImageListItemBar
                    title={`${item.post.caption.slice(0, 10)}...`}
                    subtitle={item.post.businessName}
                    position="below"
                    actionIcon={<LinkIcon />}
                />
            </Link>
        </ImageListItem>
    );
}

export default React.memo(Shoutout);
