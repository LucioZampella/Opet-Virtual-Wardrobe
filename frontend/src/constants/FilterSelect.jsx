import { useState, useRef, useEffect } from "react";

export default function FilterSelect({ label, options, value, onChange, multiple = false }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (option) => {
        if (multiple) {
            const currentValue = value || [];
            const isSelected = currentValue.some(v => v.id === option.id);
            const newValue = isSelected
                ? currentValue.filter(v => v.id !== option.id)
                : [...currentValue, option];
            onChange(newValue);
        } else {
            onChange(option);
            setIsOpen(false);
        }
    };

    const isSelected = (option) => {
        if (multiple) return (value || []).some(v => v.id === option.id);
        return value?.id === option.id;
    };

    const getDisplayText = () => {
        if (multiple) {
            const count = (value || []).length;
            if (count === 0) return label;
            return `${label}: ${count}`;
        }
        return value ? value.label : label;
    };

    const isLightColor = (hex) => {
        if (!hex) return false;
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return (r * 299 + g * 587 + b * 114) / 1000 > 180;
    };

    return (
        <div ref={containerRef} className="relative flex-1 min-w-[130px]">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-full px-3 py-2 text-left text-xs tracking-wider
                    bg-[#221f1c] border border-[#3a3530]
                    hover:border-[#4a4540] transition-colors duration-200
                    ${value && !(Array.isArray(value) && value.length === 0) ? 'text-[#e8d5b0]' : 'text-[#6b6258]'}
                    flex items-center justify-between gap-2
                `}
            >
                <span className="truncate">{getDisplayText()}</span>
                <svg className={`w-3 h-3 text-[#6b6258] flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && (
                <div className="absolute z-50 mt-1 w-full bg-[#1a1816] border border-[#3a3530] shadow-xl max-h-60 overflow-y-auto">
                    {(options || []).map(option => (
                        <button
                            key={option.id}
                            type="button"
                            onClick={() => handleSelect(option)}
                            className={`
                                w-full px-3 py-2 text-left text-xs tracking-wider
                                flex items-center gap-2
                                transition-colors duration-150
                                ${isSelected(option)
                                    ? 'text-[#c49a6c] bg-[#c49a6c]/10'
                                    : 'text-[#e8d5b0] hover:bg-[#2a2622] hover:text-[#c49a6c]'
                                }
                            `}
                        >
                            {multiple && (
                                <span className={`w-3.5 h-3.5 border flex items-center justify-center flex-shrink-0 ${isSelected(option) ? 'bg-[#c49a6c] border-[#c49a6c]' : 'border-[#4a4540]'}`}>
                                    {isSelected(option) && (
                                        <svg className="w-2.5 h-2.5 text-[#221f1c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </span>
                            )}
                            {option.hex && (
                                <span
                                    className="w-3 h-3 rounded-full flex-shrink-0"
                                    style={{
                                        backgroundColor: option.hex,
                                        border: isLightColor(option.hex) ? '1px solid #4a4540' : 'none'
                                    }}
                                />
                            )}
                            <span className="truncate">{option.label || option.name}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
