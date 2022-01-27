import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../../services/firebase/firebase-config";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import "../../lib/scss/components/my-shops/add-prize.scss";

function AddPrize({ setAlertMsg, setOpenSnackBar, prizes, setPrizes }) {
    const [newPrize, setNewPrize] = useState({
        description: "",
        emoji: "",
        pointCost: "",
        incentive: false,
        tags: "",
    });

    const addPrize = () => {
        if (newPrize.description || newPrize.emoji || newPrize.pointCost) {
            setPrizes((prevState) => [
                ...prevState,
                {
                    id: Date.now(),
                    description: newPrize.description,
                    emoji: newPrize.emoji,
                    pointCost: newPrize.pointCost,
                    incentive: newPrize.incentive,
                    tags: newPrize.tags.toLowerCase().split(" "),
                },
            ]);

            setNewPrize({
                description: "",
                emoji: "",
                pointCost: "",
                incentive: false,
                tags: "",
            });
        } else {
            setAlertMsg({
                message: "Fields cant be empty",
                severity: "error",
            });
            setOpenSnackBar(true);
        }
    };

    const handleChange = (name) => (event) => {
        setNewPrize({
            ...newPrize,
            [name]: event.target.value,
        });
    };

    const handleIncentiveChange = (event) => {
        setNewPrize((prevState) => ({
            ...prevState,
            incentive: !prevState.incentive,
        }));
    };

    const handleRemovePrize = (id) => (event) => {
        setPrizes((prevState) => prevState.filter((prize) => prize.id !== id));
    };

    console.log("New Prize: ", newPrize);
    console.log("Prizes: ", prizes);

    return (
        <div className="edit-prizes__container">
            <h3 className="delete-prize-header">Add Prize</h3>
            <TextField
                id="bio"
                label="Description"
                value={newPrize.description}
                onChange={handleChange("description")}
                margin="normal"
                className="input"
                multiline
            />
            <TextField
                id="bio"
                label="emoji"
                value={newPrize.emoji}
                onChange={handleChange("emoji")}
                margin="normal"
                className="input"
                multiline
            />
            <TextField
                id="bio"
                label="Point Cost"
                value={newPrize.pointCost}
                onChange={handleChange("pointCost")}
                margin="normal"
                className="input"
                multiline
            />
            <TextField
                id="bio"
                label="Tags"
                value={newPrize.tags}
                onChange={handleChange("tags")}
                margin="normal"
                className="input"
                multiline
            />
            <Box sx={{ minWidth: 120, marginTop: "15px" }}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                        Incentive
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={newPrize.incentive}
                        label="Incentive"
                        onChange={handleIncentiveChange}
                    >
                        <MenuItem value={true}>True</MenuItem>
                        <MenuItem value={false}>False</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <br />
            <div className="btn-wrapper">
                <div className="add-prize-btn" onClick={addPrize}>
                    Add Prize
                </div>
            </div>
            <List className="prize-list__wrapper">
                {prizes.length !== 0 &&
                    prizes?.map((item, index) => (
                        <span key={index}>
                            <ListItem className="product-list-item">
                                <ListItemAvatar>
                                    <Avatar
                                        sx={{ width: 46, height: 46 }}
                                        loading="lazy"
                                    >
                                        <span style={{ fontSize: "36px" }}>
                                            {item.emoji}
                                        </span>
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={item.description}
                                    secondary={
                                        <span>
                                            Incentive:{" "}
                                            <span>
                                                {item.incentive
                                                    ? " true"
                                                    : "false"}
                                            </span>
                                            <br />
                                            <span>
                                                <span>Tags: </span>

                                                {item.tags?.map((tag, i) => (
                                                    <span key={i}>
                                                        {tag}
                                                        {i ===
                                                        item.tags.length - 1
                                                            ? null
                                                            : ","}{" "}
                                                    </span>
                                                ))}
                                            </span>
                                        </span>
                                    }
                                />
                                <ListItemSecondaryAction
                                    sx={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        width: "60px",
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: "24px",
                                            marginRight: "20px",
                                        }}
                                        onClick={handleRemovePrize(item.id)}
                                    >
                                        ❌
                                    </div>
                                </ListItemSecondaryAction>
                            </ListItem>
                            <Divider />
                        </span>
                    ))}
                <Divider />
            </List>
        </div>
    );
}

export default React.memo(AddPrize);
