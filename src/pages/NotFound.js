import "../lib/scss/pages/not-found.scss";

function NotFound() {
    return (
        <div
            className="notfound-container"
            style={{ backgroundImage: 'url("/logo192.png")' }}
        >
            <div className="notfound-wrapper">
                <h1>404</h1>
                <h3>Page Not Found</h3>
            </div>
        </div>
    );
}

export default NotFound;
