import React, { useState, useRef } from 'react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  error?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, label, error }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh!');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Ảnh quá lớn! Vui lòng chọn ảnh nhỏ hơn 5MB.');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      const imageUrl = data.secure_url;
      
      setPreview(imageUrl);
      onChange(imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Lỗi khi tải ảnh lên. Vui lòng thử lại!');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setPreview(url);
    onChange(url);
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-neon-blue">
          {label}
        </label>
      )}

      {/* Preview */}
      {preview && (
        <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-dark-lighter border shadow-glow-blue" style={{ borderColor: 'rgba(0, 212, 255, 0.3)' }}>
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/128?text=Invalid+URL';
            }}
          />
        </div>
      )}

      {/* Upload Button */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 border rounded-lg text-neon-blue transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-glow-blue"
          style={{
            backgroundColor: 'rgba(0, 212, 255, 0.1)',
            borderColor: 'rgba(0, 212, 255, 0.4)'
          }}
          onMouseEnter={(e) => !uploading && (e.currentTarget.style.backgroundColor = 'rgba(0, 212, 255, 0.2)')}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 212, 255, 0.1)'}
        >
          {uploading ? (
            <>
              <div className="w-4 h-4 border-2 rounded-full animate-spin" 
                   style={{ 
                     borderColor: 'rgba(0, 212, 255, 0.3)',
                     borderTopColor: '#00d4ff'
                   }}
              />
              <span>Đang tải...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Tải ảnh lên</span>
            </>
          )}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* URL Input (Alternative) */}
      <div>
        <input
          type="url"
          value={value}
          onChange={handleUrlChange}
          placeholder="Hoặc dán URL ảnh trực tiếp"
          className="w-full px-4 py-2 bg-dark-lighter border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:shadow-glow-blue transition-all duration-300"
          style={{ borderColor: 'rgba(0, 212, 255, 0.3)' }}
          onFocus={(e) => {
            e.target.style.borderColor = '#00d4ff';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(0, 212, 255, 0.3)';
          }}
        />
      </div>

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      <p className="text-xs text-gray-500">
        Chấp nhận: JPG, PNG, GIF. Tối đa 5MB.
      </p>
    </div>
  );
};

export default ImageUpload;
