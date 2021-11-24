function Button({ text, color, emoji }) {
    const style = {
        display: "block",
        padding: "0.35em 1.2em",
        border: `0.1em solid ${color}`,
        margin: "0 0.3em 0.3em 0",
        borderRadius: "0.12em",
        boxSizing: "border-box",
        textDecoration: "none",
        fontWeight: "500",
        color: `${color}`,
        textAlign: "center",
        transition: "all 0.2s",
    };

    return (
        <div style={style}>
            {emoji} {text}
        </div>
    );
}

export default Button;
