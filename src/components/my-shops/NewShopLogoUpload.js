import React, { useState } from "react";
import Button from "@mui/material/Button";
import { storage, db } from "../../services/firebase/firebase-config";

import "../../lib/scss/components/my-shops/new-shop-logo-upload.scss";

import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import UploadIcon from "@mui/icons-material/Upload";

function NewShopLogoUpload({ imgUrl, userId, username, setOpenUpload }) {
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState(imgUrl);
    const [progress, setProgress] = useState(0);

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (image) {
            const uploadTask = storage.ref(`images/${image.name}`).put(image);

            uploadTask.on(
                "state-changed",
                (snapshot) => {
                    // progress bar function
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );

                    setProgress(progress);
                },
                (error) => {
                    // Error function
                    console.log(error);
                    alert(error.message);
                },
                () => {
                    // complete function...
                    storage
                        .ref("images")
                        .child(image.name)
                        .getDownloadURL()
                        .then((url) => {
                            // post image inside db
                            db.collection("posts").add({
                                timestamp: Date.now(),

                                imageUrl: url,
                                username: username,
                                userId: userId,
                            });

                            setProgress(0);

                            setImage(null);
                            setOpenUpload(false);
                        });
                }
            );
        } else {
            alert("Image Upload Failed");
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

            <Button
                style={!image && { display: "none" }}
                onClick={handleUpload}
            >
                Upload
            </Button>
        </div>
    );
}

export default NewShopLogoUpload;
