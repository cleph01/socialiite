import React, { useState, useEffect, useRef } from "react";
import { findDOMNode } from "react-dom";
// import screenfull from "screenfull";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";

// import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import ReactPlayer from "react-player";
import LinearProgress from "@mui/material/LinearProgress";

// const useStyles = makeStyles((theme) => ({
//     flex: {
//         display: "flex",
//     },
//     primaryDashed: {
//         background: "none",
//         backgroundColor: theme.palette.secondary.main,
//     },
//     primaryColor: {
//         backgroundColor: "#6969694f",
//     },
//     dashed: {
//         animation: "none",
//     },
//     controls: {
//         position: "relative",
//         backgroundColor: "#ababab52",
//     },
//     rangeRoot: {
//         position: "absolute",
//         width: "100%",
//         top: "-7px",
//         zIndex: "3456",
//         "-webkit-appearance": "none",
//         backgroundColor: "rgba(0,0,0,0)",
//     },
//     videoError: {
//         width: "100%",
//         textAlign: "center",
//         color: theme.palette.primary.light,
//     },
// }));

export default function MediaPlayer(props) {
    // const classes = useStyles();
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(0.8);
    const [muted, setMuted] = useState(false);
    const [duration, setDuration] = useState(0);
    const [seeking, setSeeking] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1.0);
    const [loop, setLoop] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);
    const [videoError, setVideoError] = useState(false);
    let playerRef = useRef(null);
    const [values, setValues] = useState({
        played: 0,
        loaded: 0,
        ended: false,
    });

    // useEffect(() => {
    //     if (screenfull.isEnabled) {
    //         screenfull.on("change", () => {
    //             let fullscreen = screenfull.isFullscreen ? true : false;
    //             setFullscreen(fullscreen);
    //         });
    //     }
    // }, []);
    useEffect(() => {
        setVideoError(false);
    }, [props.srcUrl]);
    const changeVolume = (e) => {
        setVolume(parseFloat(e.target.value));
    };
    const toggleMuted = () => {
        setMuted(!muted);
    };
    const playPause = () => {
        setPlaying(!playing);
    };
    const onLoop = () => {
        setLoop(!loop);
    };
    const onProgress = (progress) => {
        // We only want to update time slider if we are not currently seeking
        if (!seeking) {
            setValues({
                ...values,
                played: progress.played,
                loaded: progress.loaded,
            });
        }
    };
    // const onClickFullscreen = () => {
    //     screenfull.request(findDOMNode(playerRef));
    // };
    const onEnded = () => {
        if (loop) {
            setPlaying(true);
        } else {
            props.handleAutoplay(() => {
                setValues({ ...values, ended: true });
                setPlaying(false);
            });
        }
    };
    const onDuration = (duration) => {
        setDuration(duration);
    };
    const onSeekMouseDown = (e) => {
        setSeeking(true);
    };
    const onSeekChange = (e) => {
        setValues({
            ...values,
            played: parseFloat(e.target.value),
            ended: parseFloat(e.target.value) >= 1,
        });
    };
    const onSeekMouseUp = (e) => {
        setSeeking(false);
        playerRef.seekTo(parseFloat(e.target.value));
    };
    const ref = (player) => {
        playerRef = player;
    };
    const format = (seconds) => {
        const date = new Date(seconds * 1000);
        const hh = date.getUTCHours();
        let mm = date.getUTCMinutes();
        const ss = ("0" + date.getUTCSeconds()).slice(-2);
        if (hh) {
            mm = ("0" + date.getUTCMinutes()).slice(-2);
            return `${hh}:${mm}:${ss}`;
        }
        return `${mm}:${ss}`;
    };
    const showVideoError = (e) => {
        console.log(e);
        setVideoError(true);
    };

    return <div>Media Player</div>;
}
