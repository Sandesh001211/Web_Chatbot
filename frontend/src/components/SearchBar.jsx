import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearch }) => {
    return (
        <div className="px-3 pb-3">
            <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search chats..."
                    className="w-full bg-[#2A2B32] border border-gray-600 rounded-md py-1.5 pl-9 pr-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors"
                    onChange={(e) => onSearch(e.target.value)}
                />
            </div>
        </div>
    );
};

export default SearchBar;
