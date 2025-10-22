import React, { useState, useEffect } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";

const ImageUploader = ({
  initialImages = [],
  onImagesChange,
  isUploading = false,
  maxImages = 5,
}) => {
  const [previews, setPreviews] = useState([]);
  const [files, setFiles] = useState([]);

  // Load initial images from props (for edit mode)
  useEffect(() => {
    if (Array.isArray(initialImages) && initialImages.length > 0) {
      setPreviews(initialImages);
    }
  }, [initialImages]);

  // When user selects files
 const handleFileChange = (e) => {
  const selectedFiles = Array.from(e.target.files);

  const availableSlots = maxImages - previews.length; // remaining slots
  if (selectedFiles.length > availableSlots) {
    alert(`You can upload only ${availableSlots} more image(s).`);
    selectedFiles.splice(availableSlots); // only take allowed files
  }

  const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
  setFiles((prev) => [...prev, ...selectedFiles]);
  setPreviews((prev) => [...prev, ...newPreviews]);

  onImagesChange?.([...files, ...selectedFiles], [...previews, ...newPreviews]);
};


  // Remove one image
  const handleRemoveImage = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);

    setFiles(updatedFiles);
    setPreviews(updatedPreviews);

    if (typeof onImagesChange === "function") {
      onImagesChange(updatedFiles, updatedPreviews);
    }
  };

  return (
    <div className="p-4 bg-gray-900 border border-gray-700 rounded-xl">
      <label className="block text-sm font-medium text-gray-300 mb-3">
        Product Images (Max {maxImages})
      </label>

      {/* Upload Button */}
      <div className="flex items-center gap-3 mb-4">
        <label
          htmlFor="file-upload"
          className={`cursor-pointer flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition font-semibold ${
            isUploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <Upload size={18} />
          Upload Images
        </label>
        <input
          id="file-upload"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </div>

      {/* Image Previews */}
      {previews.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-gray-700 rounded-xl p-6 text-gray-500">
          <ImageIcon size={32} className="mb-2" />
          <p>No images uploaded yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {previews.map((src, index) => (
            <div
              key={index}
              className="relative group border border-gray-700 rounded-lg overflow-hidden"
            >
              <img
                src={src}
                alt={`upload-${index}`}
                className="object-cover w-full h-28 rounded-lg"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                title="Remove"
                disabled={isUploading}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
