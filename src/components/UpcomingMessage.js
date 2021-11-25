import UpcomingIcon from "@mui/icons-material/Upcoming";

function UpcomingMessage({ message, emoji }) {
    return (
        <div
            className="upcoming-container"
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <div style={{ fontSize: "73px" }}>{emoji}</div>
            <div
                style={{
                    fontSize: "18px",
                    color: "#888997",
                    textAlign: "center",
                    marginBottom: "5px",
                }}
            >
                {message}
            </div>{" "}
            <UpcomingIcon sx={{ color: "#bdbdbd", fontSize: "73px" }} />
        </div>
    );
}

export default UpcomingMessage;
