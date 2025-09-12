import {
  InputBase,
  Paper,
  IconButton,
  Typography,
  Divider,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import React, { useState, useCallback, useEffect, useRef } from "react";
import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import lgZoom from "lightgallery/plugins/zoom";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import SearchAutocomplete from "~/compoents/SearchAutocomplete";
import TagImageGenerator from "~/compoents/TagImageGenerator";

export function Generate() {
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagsToGenerate, setTagsToGenerate] = useState([]);

  const handleTagsChange = (tags) => {
    setSelectedTags(tags);
  };

  const handleSearchClick = () => {
    setTagsToGenerate(selectedTags);
  };

  return (
    <Box m={2} display="flex" flexDirection="column" alignItems="center" flexGrow={1}>
      <SearchAutocomplete onTagsChange={handleTagsChange} onSubmit={handleSearchClick} />
      <Box mt={4}>
        <TagImageGenerator tags={tagsToGenerate.length > 0 ? tagsToGenerate : [{ tag: "" }]} />
      </Box>
    </Box>
  );
}