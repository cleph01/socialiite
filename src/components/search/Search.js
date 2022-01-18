import { useState } from "react";

import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

import Divider from "@mui/material/Divider";

import { db } from "../../services/firebase/firebase-config";

import "../../lib/scss/components/search/search.scss";
import SearchResults from "./SearchResults";

function Search() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchType, setSearchType] = useState("prizes");
    const [searchResults, setSearchResults] = useState([]);

    const handleSelectChange = (event) => {
        setSearchType(event.target.value);
        setSearchResults([]);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = () => {
        if (searchType === "shops" && searchTerm !== "") {
            // Clear previous Result set
            setSearchResults([]);

            db.collection("shops")
                .where("tags", "array-contains", searchTerm)
                .get()
                .then((querySnapshot) => {
                    setSearchResults(
                        querySnapshot.docs.map((doc) => ({
                            businessId: doc.id,
                            ...doc.data(),
                        }))
                    );
                })
                .catch((error) => {
                    console.log("Error getting Shop Search: ", error);
                });
        } else if (searchType === "prizes" && searchTerm !== "") {
            // Clear previous Result set
            setSearchResults([]);

            db.collection("prizes")
                .where("tags", "array-contains", searchTerm)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.docs.forEach((prize) => {
                        db.collection("shops")
                            .doc(prize.data().businessId)
                            .get()
                            .then((doc) => {
                                setSearchResults((prevState) => [
                                    ...prevState,
                                    { businessId: doc.id, ...doc.data() },
                                ]);
                            })
                            .catch((error) => {
                                console.log(
                                    "Error getting Shop in Prize Search: ",
                                    error
                                );
                            });
                    });
                })
                .catch((err) => {
                    console.log("Error getting Prize Search: ", err);
                });
        }
    };

    console.log("Search Results: ", searchResults);

    return (
        <div className="search-wrapper">
            <h3>Search</h3>

            <div className="search-bar-wrapper">
                <TextField
                    sx={{ width: "33%" }}
                    label="Search Type"
                    value={searchType}
                    onChange={handleSelectChange}
                    margin="normal"
                    select
                >
                    <MenuItem value="prizes">Prizes</MenuItem>
                    <MenuItem value="shops">Shops</MenuItem>
                </TextField>

                <TextField
                    sx={{ marginLeft: "5px" }}
                    label="Search Tags"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    margin="normal"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <SearchIcon onClick={handleSearch} />
                            </InputAdornment>
                        ),
                    }}
                />
            </div>

            <Divider />

            {searchResults && <SearchResults searchResults={searchResults} />}
        </div>
    );
}

export default Search;
