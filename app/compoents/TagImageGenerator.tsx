import React, { useState, useCallback, useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import LightGallery from "lightgallery/react";
import lgZoom from "lightgallery/plugins/zoom";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

type Tag = { tag: string; score?: number };

interface TagImageGeneratorProps {
    tags: Tag[];
}

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const TagImageGenerator: React.FC<TagImageGeneratorProps> = ({ tags }) => {
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

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
                        setLoadingText(null);
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
                        await delay(2000);
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

    // This function triggers the image generation process
    const generateImages = useCallback(async () => {
        const promptText = tags.map((t) => t.tag).join(", ");
        if (!promptText || promptText.trim() === "" || promptText.length < 5) return;

        setImages([]);
        setLoading(true);
        setError(null);
        setLoadingText("Generating image...");

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

            await pollForResults(promptId);
        } catch (err) {
            setLoadingText("Error generating image.");
            setLoading(false);
            setImages([]);
            setError((err as Error).message);
        }
    }, [tags, pollForResults]);

    // Run generateImages effect immediately when tags prop changes with length > 0
    useEffect(() => {
        if (tags.length > 0) {
            generateImages();
        }
    }, [tags, generateImages]);

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100%">
            {loading && (
                <Box mt={2} textAlign="center">
                    <CircularProgress />
                    <Typography variant="body1" mt={2}>
                        {loadingText}
                    </Typography>
                </Box>
            )}

            {error && (
                <Typography color="error" mt={2}>
                    {error}
                </Typography>
            )}

            {images.length > 0 && (
                <LightGallery speed={500} plugins={[lgZoom, lgThumbnail]}>
                    {images.map((src) => (
                        <a href={src}>
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
                    ))}
                </LightGallery>
            )}
        </Box>
    );
};

export default TagImageGenerator;
