import React, { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";


const CSVUpload = ({ testId }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: ".csv",
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        setMessage("");
      }
    },
    onDropRejected: () => {
      setMessage("Only CSV files are allowed.");
    },
  });

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a CSV file.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `http://127.0.0.1:8000/portal/test/${testId}/upload_csv/`,
        formData,
        { headers: { Authorization: `Token ${token}`, "Content-Type": "multipart/form-data" } }
      );

      setMessage(response.data.message);
      setFile(null);
      
    } catch (error) {
      setMessage(error.response?.data?.error || "File upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ textAlign: "center", p: 3, border: "2px dashed #aaa", borderRadius: "8px", bgcolor: "#f9f9f9" }} {...getRootProps()}>
      <input {...getInputProps()} />
      <CloudUploadIcon sx={{ fontSize: 50, color: "#777" }} />
      <Typography variant="h6">Drag & Drop your CSV file here</Typography>
      <Typography variant="body2" color="textSecondary">or click to select a file</Typography>

      {file && (
        <Typography variant="body1" sx={{ mt: 2, color: "#333" }}>
          Selected File: {file.name}
        </Typography>
      )}

      {message && (
        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
        onClick={handleUpload}
        disabled={uploading}
      >
        {uploading ? <CircularProgress size={24} /> : "Upload"}
      </Button>
    </Box>
  );
};

export default CSVUpload;
