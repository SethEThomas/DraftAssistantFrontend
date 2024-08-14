import React from 'react';
import './SearchInput.css';

interface SearchInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, placeholder = "Enter a player name to search" }) => {
    return (
        <div className="search-container">
            <input
                type="text"
                className="search-input"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}

export default SearchInput;
