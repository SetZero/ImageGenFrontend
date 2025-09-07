import {
  InputBase,
  Paper,
  IconButton,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import React, { useState, useCallback } from "react";
import LightGallery from 'lightgallery/react';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import lgZoom from 'lightgallery/plugins/zoom';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

export function Generate() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const pollForResults = useCallback(
    async (promptId: string) => {
      const progressUrl = `/api/progress/${promptId}`;
      try {
        let keepPolling = true;
        while (keepPolling) {
          const response = await fetch(progressUrl);
          if (!response.ok) throw new Error("Failed to fetch progress");
          const progressData = await response.json();

          if (progressData.status === "ready" && progressData.outputs) {
            keepPolling = false;
            setLoading(false);
            setLoadingText("");
            const loadedImages: string[] = [];
            for (const nodeId in progressData.outputs) {
              const nodeOutput = progressData.outputs[nodeId];
              if (nodeOutput && Array.isArray(nodeOutput.images)) {
                nodeOutput.images.forEach((image: { filename: string }) => {
                  loadedImages.push(`/api/static/${image.filename}`);
                });
              }
            }
            setImages(loadedImages);
          } else {
            setLoadingText("Generating image... (progress: waiting)");
            await delay(2000); // wait 2s before next poll
          }
        }
      } catch (err) {
        setLoadingText("Error fetching progress.");
        setLoading(false);
        setImages([]);
        setError((err as Error).message);
      }
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const promptText = prompt.trim();
    if (!promptText) return;

    setImages([]);
    setLoading(true);
    setLoadingText("Generating image...");
    setError(null);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptText }),
      });
      if (!response.ok) throw new Error("Failed to generate image");
      const data = await response.json();

      const promptId = data.prompt_id;
      if (!promptId) throw new Error("No prompt_id returned from server");

      pollForResults(promptId);
    } catch (err) {
      setLoadingText("Error generating image.");
      setLoading(false);
      setImages([]);
      setError((err as Error).message);
    }
  };

  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "calc(100vh - 2rem)",
        margin: 2,
      }}
      className="container"
    >
      <Typography variant="h1" gutterBottom>
        AI Image Prompt
      </Typography>

      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 600 }}
      >
        <IconButton sx={{ p: "10px" }} aria-label="menu" type="button">
          <MenuIcon />
        </IconButton>

        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Enter a description of an image"
          inputProps={{ "aria-label": "description" }}
          multiline
          minRows={1}
          maxRows={12}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />

        <IconButton color="primary" sx={{ p: "10px" }} aria-label="generate" type="submit">
          <DoubleArrowIcon />
        </IconButton>
      </Paper>

      {loading && (
        <Typography sx={{ mt: 2 }}>
          {loadingText} {<CircularProgress size={14} sx={{ ml: 1, verticalAlign: 'middle' }} />}
        </Typography>
      )}

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          Error: {error}
        </Typography>
      )}

      <LightGallery speed={500} plugins={[lgZoom, lgThumbnail]}>
        <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
          {images.map((src) => (
            <ImageListItem key={src}>
              <a key={src} href={src}>
                <img
                  src={`${src}?w=164&h=164&fit=crop&auto=format`}
                  srcSet={`${src}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                  alt="Generated"
                  loading="lazy"
                  style={{
                    borderRadius: 12,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.14)",
                    cursor: "pointer",
                  }}
                />
              </a>
            </ImageListItem>
          ))}
        </ImageList>
      </LightGallery>
    </Paper>
  );
}
