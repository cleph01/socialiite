function MenuButton({ text, color, emoji }) {
    const wrapperStyle = {
        display: "flex",
        flexDirection: "row",
        width: "145px",
        padding: "0.35em 0.35em",
        border: `0.1em solid ${color}`,
        margin: "0 0.2em 0.2em 0",
        borderRadius: "0.12em",
        boxSizing: "border-box",
        textDecoration: "none",
        fontWeight: "500",
        color: `${color}`,
        transition: "all 0.2s",
        cursor: "pointer",
    };

    return (
        <div style={wrapperStyle}>
            <div style={{ width: "100%", margin: "auto auto" }}>
                <span
                    style={{
                        display: "inline-block",
                        width: "50px",
                        textAlign: "center",
                    }}
                >
                    {emoji}
                </span>{" "}
                <span
                    style={{
                        marginLeft: "2px",
                        width: "fit-content",
                    }}
                >
                    {text}
                </span>
            </div>
        </div>
    );
}

export default MenuButton;
