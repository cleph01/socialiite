import React, { useState } from "react";

import "../../lib/scss/components/my-shops/new-shop-logo-upload.scss";

import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import UploadIcon from "@mui/icons-material/Upload";

function EditShopLogoUpload({ setValues, values }) {
    const [progress, setProgress] = useState(0);

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setValues((prevState) => ({
                ...prevState,
                image: e.target.files[0],
            }));
        }
    };

    return (
        <div className="profile-imageupload">
            <center>
                {/* <img className="avatar" src={logo} alt="avatar" /> */}
                <InsertPhotoIcon
                    style={{ fontSize: "69px", color: "#516186" }}
                />
            </center>

            <progress
                className="imageupload__progress"
                value={progress}
                max="100"
            />
            <div className="file-input">
                <input
                    type="file"
                    className="file"
                    id="file"
                    onChange={handleChange}
                />
                <label htmlFor="file">
                    Upload Logo <UploadIcon />
                    <p className="file-name"></p>
                </label>
            </div>
        </div>
    );
}

export default EditShopLogoUpload;
