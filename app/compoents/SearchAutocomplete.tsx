import React, { useEffect, useState } from "react";
import { Autocomplete, TextField, CircularProgress, Box, Button } from "@mui/material";

function SearchAutocomplete({ onTagsChange, onSubmit }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState([]); // array for multiple values
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (inputValue.length < 2) {
      setOptions([]);
      return;
    }
    let active = true;
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(inputValue)}`)
      .then((r) => r.json())
      .then((data) => {
        if (active) {
          setOptions(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setOptions([]);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [inputValue]);

  const handleChange = (e, newValue) => {
    setValue(newValue);
    if (onTagsChange) {
      onTagsChange(newValue);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <Box display="flex" alignItems="center" gap={0}>
        <Autocomplete
          multiple
          options={options}
          loading={loading}
          value={value}
          onChange={handleChange}
          inputValue={inputValue}
          onInputChange={(e, newInputValue) => setInputValue(newInputValue)}
          filterOptions={(x) => x}
          getOptionLabel={(option) => option.tag || ""}
          renderOption={(props, option) => (
            <li {...props}>
              {option.tag}{" "}
              <span style={{ marginLeft: 8, color: "#888", fontSize: 12 }}>
                score: {option.score}
              </span>
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Tag search"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? <CircularProgress size={20} sx={{ mr: 2 }} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
              sx={{ minWidth: 250 }}
            />
          )}
          sx={{ flexGrow: 1 }}
        />
        <Button
          type="submit" // makes button submit form
          variant="contained"
          disableElevation
          size="medium"
          sx={{
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            height: "56px", // Match TextField default height (adjust if needed)
            paddingX: 2,
          }}
        >
          Generate
        </Button>
      </Box>
    </form>
  );
}

export default SearchAutocomplete;
