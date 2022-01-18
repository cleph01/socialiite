import { useContext } from "react";

import { UserContext } from "../../../contexts/UserContext";

import platform from "platform-detect/os.mjs";

import encodeurl from "encodeurl";

import Box from "@mui/material/Box";

import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import ForumIcon from "@mui/icons-material/Forum";

import { InlineShareButtons } from "sharethis-reactjs";

const style = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 355,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

function ShareModal({ openShareModal, handleCloseShareModal, shareBusiness }) {
    const { authUser } = useContext(UserContext);

    const encodeMsg = authUser
        ? encodeurl(
              `Wanted to share this with you. Check them out. ${
                  shareBusiness
                      ? shareBusiness.businessName +
                        ": https://socialiite.web.app/shops/" +
                        shareBusiness.businessId
                      : "undefined"
              }`
          )
        : null;

    const smsMessage =
        platform.macos || platform.ios
            ? `sms:&body=${encodeMsg}`
            : `sms:?body=${encodeMsg}`;

    return (
        <Modal
            open={openShareModal}
            onClose={handleCloseShareModal}
            aria-labelledby="modal2-modal-title"
            aria-describedby="modal2-modal-description"
        >
            <Box sx={style}>
                <Typography
                    id="modal2-modal-title"
                    variant="h6"
                    component="h2"
                    sx={{ textAlign: "center", borderColor: "#f0f0f0" }}
                >
                    Shout Out Your Favorite Shops and Get Paid!
                </Typography>
                <Typography
                    id="modal2-modal-description"
                    sx={{ mt: 2, textAlign: "center" }}
                >
                    Click Below and Go Social !!
                </Typography>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "15px",
                    }}
                >
                    <InlineShareButtons
                        config={{
                            alignment: "center", // alignment of buttons (left, center, right)
                            color: "social", // set the color of buttons (social, white)
                            enabled: true, // show/hide buttons (true, false)
                            font_size: 16, // font size for the buttons
                            labels: "cta", // button labels (cta, counts, null)
                            language: "en", // which language to use (see LANGUAGES)
                            networks: [
                                // which networks to include (see SHARING NETWORKS)
                                "whatsapp",
                                "linkedin",
                                "messenger",
                                "facebook",
                                "twitter",
                            ],
                            padding: 12, // padding within buttons (INTEGER)
                            radius: 4, // the corner radius on each button (INTEGER)
                            show_total: true,
                            size: 40, // the size of each button (INTEGER)

                            // OPTIONAL PARAMETERS
                            // url: `https://smartseedtech.com/${shareBusiness.businessId}`, // (defaults to current url)
                            url: "https://www.chickenshacknyc.com/",
                            description: `Business Name: ${
                                shareBusiness
                                    ? shareBusiness.businessName
                                    : "undefined"
                            }`, // (defaults to og:description or twitter:description)
                            title: `Business Name: ${
                                shareBusiness
                                    ? shareBusiness.businessName
                                    : "undefined"
                            }`, // (defaults to og:title or twitter:title)
                            message: `Business Name: ${
                                shareBusiness
                                    ? shareBusiness.businessName
                                    : "undefined"
                            }`, // (only for email sharing)
                            subject: `Business Name: ${
                                shareBusiness
                                    ? shareBusiness.businessName
                                    : "undefined"
                            }`, // (only for email sharing)
                        }}
                    />
                    <div>
                        <center>
                            <h3>or Send a Text! </h3>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: "36px",
                                        marginRight: "20px",
                                    }}
                                >
                                    {String.fromCodePoint(0x1f449)}
                                </span>
                                <a href={smsMessage}>
                                    <ForumIcon
                                        sx={{
                                            color: "#1c76d2",
                                            fontSize: "52px",
                                        }}
                                    />
                                </a>
                            </div>
                        </center>
                    </div>
                </div>
            </Box>
        </Modal>
    );
}

export default ShareModal;
