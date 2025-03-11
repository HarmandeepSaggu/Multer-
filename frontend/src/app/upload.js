"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define validation schema with Zod (Max 5 files)
const fileSchema = z.object({
  files: z
    .instanceof(FileList, { message: "At least one file is required" })
    .refine((fileList) => fileList.length > 0, {
      message: "At least one file must be selected",
    })
    .refine((fileList) => fileList.length <= 5, {
      message: "You can select up to 5 files only",
    })
    .refine(
      (fileList) => Array.from(fileList).every((file) => file.size < 1 * 1024 * 1024),
      { message: "Each file must be less than 1MB" }
    )
    .refine(
      (fileList) => Array.from(fileList).every((file) => ["image/png", "image/jpeg"].includes(file.type)),
      { message: "Only PNG and JPEG files are allowed" }
    ),
});

export default function FileUpload() {
  const [previews, setPreviews] = useState([]);

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(fileSchema),
  });

  // Show toast notifications on validation errors
  useEffect(() => {
    if (errors.files) {
      toast.error(errors.files.message);
    }
  }, [errors]);

  const handleFileChange = (e) => {
    const files = e.target.files;
    setValue("files", files);
    setPreviews(Array.from(files).map((file) => URL.createObjectURL(file)));
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    Array.from(data.files).forEach((file) => formData.append("files", file));

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        toast.success("Files uploaded successfully!");
        console.log("Uploaded Files:", result.fileUrls);
      } else {
        toast.error("File upload failed");
      }
    } catch (error) {
      toast.error("File upload failed");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-gray-100 rounded-lg shadow-lg">
      <ToastContainer position="top-right" autoClose={3000} />
      {/* File Input */}
      <input
        type="file"
        accept="image/png, image/jpeg"
        multiple
        onChange={handleFileChange}
        className="mb-2 block w-full p-2 border rounded"
      />

      {/* Image Previews */}
      {previews.length > 0 && (
        <div className="mt-4">
          <p className="font-semibold">Selected Image Previews:</p>
          <div className="grid grid-cols-2 gap-2">
            {previews.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Selected Preview ${index + 1}`}
                className="mt-2 w-full rounded-lg shadow"
              />
            ))}
          </div>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleSubmit(onSubmit)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mt-3"
      >
        Upload
      </button>
    </div>
  );
}
