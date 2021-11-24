import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";

import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import GitHubIcon from "@mui/icons-material/GitHub";
import WebIcon from "@mui/icons-material/Web";

function Socials({ socials }) {
    return (
        <Stack
            align="center"
            direction="row"
            spacing={1}
            style={{
                display: Object.keys(socials).length > 0 ? "block" : "none",
            }}
        >
            {socials.facebook && (
                <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={socials.facebook}
                >
                    <IconButton aria-label="facebook-icon">
                        <FacebookIcon className="facebook" />
                    </IconButton>
                </a>
            )}
            {socials.instagram && (
                <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={socials.instagram}
                >
                    <IconButton aria-label="instagram-icon">
                        <InstagramIcon className="instagram" />
                    </IconButton>
                </a>
            )}
            {socials.linkedIn && (
                <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={socials.linkedIn}
                >
                    <IconButton aria-label="linkedIn-icon">
                        <LinkedInIcon className="linkedin" />
                    </IconButton>
                </a>
            )}
            {socials.twitter && (
                <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={socials.twitter}
                >
                    <IconButton aria-label="twitter-icon">
                        <TwitterIcon className="twitter" />
                    </IconButton>
                </a>
            )}
            {socials.youtube && (
                <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={socials.youtube}
                >
                    <IconButton aria-label="youtube-icon">
                        <YouTubeIcon className="youtube" />
                    </IconButton>
                </a>
            )}
            {socials.github && (
                <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={socials.github}
                >
                    <IconButton aria-label="github-icon">
                        <GitHubIcon className="github" />
                    </IconButton>
                </a>
            )}
            {socials.web && (
                <a target="_blank" rel="noopener noreferrer" href={socials.web}>
                    <IconButton aria-label="webpage-icon">
                        <WebIcon className="web" />
                    </IconButton>
                </a>
            )}
        </Stack>
    );
}

export default Socials;
