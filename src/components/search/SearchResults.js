import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import List from "@mui/material/List";

import SearchResultsItem from "./SearchResultsItem";

import Skeleton from "@mui/material/Skeleton";

import Divider from "@mui/material/Divider";

import "../../lib/scss/components/search/search-result-list.scss";

import { db } from "../../services/firebase/firebase-config";

function SearchResults({ searchResults }) {
    if (!searchResults) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "10px",
                }}
                className="hero-home__container"
            >
                <Skeleton variant="rectangular" width={350} height={218} />
            </div>
        );
    }

    return (
        <List className="search-result-list-container">
            {searchResults.map((result, i) => (
                <div key={i}>
                    <SearchResultsItem result={result} />
                    <Divider />
                </div>
            ))}
        </List>
    );
}

export default SearchResults;
