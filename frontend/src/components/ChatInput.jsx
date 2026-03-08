import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Plus, X, Image as ImageIcon } from 'lucide-react';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ChatInput = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState('');
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const resizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  useEffect(() => {
    resizeTextarea();
  }, [message]);

  const handleFileChange = (e) => {
    setError('');
    const file = e.target.files[0];
    if (!file) return;

    // Validation
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('Image size should be less than 5MB.');
      return;
    }

    // Process and compress image
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            const maxDimension = 800; // max width/height

            if (width > height && width > maxDimension) {
                height *= maxDimension / width;
                width = maxDimension;
            } else if (height > maxDimension) {
                width *= maxDimension / height;
                height = maxDimension;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            // Compress to JPEG with 0.7 quality to ensure small size for Firestore
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
            setSelectedImage(compressedBase64);
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // Reset input so same file can be selected again if needed
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = (e) => {
    if (e?.preventDefault) e.preventDefault();
    
    const hasText = message.trim().length > 0;
    const hasImage = !!selectedImage;

    if ((hasText || hasImage) && !isLoading) {
      onSendMessage(message, selectedImage);
      setMessage('');
      setSelectedImage(null);
      setError('');
      if (textareaRef.current) {
         textareaRef.current.style.height = 'auto';
      }
    }
  };

  return (
    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#343541] via-[#343541] to-transparent pt-6 pb-6 z-10">
      <div className="max-w-3xl mx-auto px-4 md:px-0 relative mb-4">
        {error && (
            <div className="mb-2 text-red-400 text-sm bg-red-400/10 px-4 py-2 rounded-lg border border-red-400/20 w-fit mx-auto shadow-sm">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="relative flex flex-col bg-[#40414F] shadow-lg rounded-2xl border border-gray-600/50 focus-within:ring-1 focus-within:ring-gray-300 focus-within:border-gray-500 overflow-hidden transition-all">
          
          {/* Image Preview Area */}
          {selectedImage && (
            <div className="px-4 pt-4 pb-1">
                <div className="relative inline-block group">
                    <img 
                      src={selectedImage} 
                      alt="Preview" 
                      className="h-20 w-20 object-cover rounded-xl border border-gray-600 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-gray-700 text-gray-200 hover:bg-gray-600 hover:text-white rounded-full p-1 shadow-md transition-colors"
                      title="Remove image"
                    >
                      <X size={14} />
                    </button>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center pointer-events-none">
                        <ImageIcon className="text-white/70" size={24} />
                    </div>
                </div>
            </div>
          )}

          <div className="flex items-end pr-2 pb-1">
              <input 
                 type="file"
                 ref={fileInputRef}
                 onChange={handleFileChange}
                 accept="image/png, image/jpeg, image/jpg, image/webp"
                 className="hidden"
              />
              <button
                 type="button"
                 onClick={() => fileInputRef.current?.click()}
                 className="flex-shrink-0 p-2.5 m-2 mr-0 text-gray-400 hover:text-white hover:bg-gray-600 rounded-full transition-colors flex items-center justify-center"
                 title="Upload image"
              >
                 <Plus size={22} className="stroke-[2.5]" />
              </button>

              <textarea
                ref={textareaRef}
                rows="1"
                className="w-full bg-transparent text-gray-100 placeholder-gray-400 p-3.5 md:p-4 focus:outline-none resize-none max-h-[200px] mb-[-2px] min-h-[52px]"
                placeholder="Send a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || (!message.trim() && !selectedImage)}
                className={`flex-shrink-0 p-2 text-white bg-blue-500 rounded-lg shadow-sm hover:bg-blue-600 disabled:opacity-30 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-all m-2 mb-2.5 ${(!message.trim() && !selectedImage) ? 'opacity-50' : ''}`}
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
          </div>
        </form>
        <div className="text-center text-xs text-gray-400 mt-3 absolute -bottom-5 left-0 right-0">
          Gemini can make mistakes. Check important info.
        </div>
      </div>
    </div>
  );
};

export default ChatInput;

