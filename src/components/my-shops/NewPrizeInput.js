import React from "react";

import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

function NewPrizeInput({
    index,
    age,
    handleAgeChange,
    handlePrizeChange,
    setPrize,
    deletePrizeField,
}) {
    return (
        <div
            style={{
                border: "1px solid #000",
                borderRadius: "5px",
                marginBottom: "10px",
            }}
        >
            <div
                className="prize-input-header"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0px 10px",
                }}
            >
                <h3>Prize {index}</h3>
                <div onClick={() => deletePrizeField(index)}>❌</div>
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <div>
                    <TextField
                        label="Prize Description"
                        value={setPrize}
                        onChange={handlePrizeChange}
                        margin="normal"
                    />
                </div>
                <div style={{ display: "flex" }}>
                    <TextField
                        label="Emoji Picker"
                        value={setPrize}
                        onChange={handlePrizeChange}
                        margin="normal"
                    />
                    <TextField
                        label="Points Cost"
                        value={setPrize}
                        onChange={handlePrizeChange}
                        margin="normal"
                    />
                    <div>
                        <InputLabel id="demo-simple-select-label">
                            Incentive
                        </InputLabel>

                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={age}
                            label="Age"
                            onChange={handleAgeChange}
                        >
                            <MenuItem value={true}>Yes</MenuItem>
                            <MenuItem value={false}>No</MenuItem>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewPrizeInput;
