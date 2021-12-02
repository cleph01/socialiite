function MenuButton({ text, color, emoji }) {
    const wrapperStyle = {
        display: "flex",
        flexDirection: "row",
        padding: "0.35em 1.2em",
        border: `0.1em solid ${color}`,
        margin: "0 0.3em 0.3em 0",
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
            <div style={{ width: "85%", margin: "auto auto" }}>
                <span
                    style={{
                        display: "inline-block",
                        width: "60px",
                        textAlign: "center",
                    }}
                >
                    {emoji}
                </span>{" "}
                <span
                    style={{
                        marginLeft: "15px",
                        width: "125px",
                    }}
                >
                    {text}
                </span>
            </div>
        </div>
    );
}

export default MenuButton;
