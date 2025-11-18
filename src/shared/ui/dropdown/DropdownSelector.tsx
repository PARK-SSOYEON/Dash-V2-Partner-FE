import React, {useState, useMemo, useRef, useEffect} from 'react';
import {cva} from 'class-variance-authority';
import {Option} from './Option';
import {Icon} from "../Icon.tsx";

interface Item {
    id: string;
    label: string;
    phone?: string;
}

interface DropdownSelectorProps {
    placeholder: string;
    searchPlaceholder: string;
    data: Item[];
    onSelect: (item: Item | null) => void;
}

const inputContainerVariants = cva(
    'flex items-center justify-between p-5 transition-all duration-200 bg-white/60 backdrop-blur-sm rounded-full text-base font-semibold',
    {
        variants: {
            isActive: {
                true: 'border border-(--color-blue-500) text-(--color-blue-500)',
                false: 'gradient-border text-black/30',
            },
        },
        defaultVariants: {
            isActive: false,
        },
    }
);

export const DropdownSelector: React.FC<DropdownSelectorProps> = ({
                                                                      placeholder,
                                                                      searchPlaceholder,
                                                                      data,
                                                                      onSelect,
                                                                  }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const isActive = isFocused || !!selectedItem;
    const activeTextClass = isActive ? 'text-(--color-blue-500)' : '';
    const containerRef = useRef<HTMLDivElement>(null);

    // 외부 클릭시 dropdown close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Filtered and sorted options
    const filteredOptions = useMemo(() => {
        const normalizedQuery = searchTerm.trim().toLowerCase();

        if (normalizedQuery.length === 0) {
            return [];
        }

        return data.filter((item) =>
            item.label.toLowerCase().includes(normalizedQuery)
        );
    }, [data, searchTerm]);

    // Handle selection of an item
    const handleSelect = (item: Item) => {
        setSelectedItem(item);
        onSelect(item);
        setSearchTerm('');
        setIsFocused(false);
    };

    // The label displayed in the main input field
    const displayLabel = selectedItem ? selectedItem.label : placeholder;

    // Is the main input currently showing the search box (i.e., is it focused)
    const isSearchActive = isFocused;

    return (
        <div className="relative w-full" ref={containerRef}>
            {/* 1. Main Input/Display Area */}
            <div
                className={inputContainerVariants({isActive})}
                onClick={() => setIsFocused(true)}
            >
                {isSearchActive ? (
                    <input
                        type="text"
                        className={`w-full focus:outline-none text-base font-semibold ${activeTextClass}`}
                        placeholder={searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                ) : (
                    <span className={`text-base font-semibold ${activeTextClass}`}>
                        {displayLabel}
                    </span>
                )}

                <div className={`ml-2 ${activeTextClass}`}>
                    {isFocused ? (
                        <Icon name={"upChevron"} size={24}/>
                    ) : (
                        <Icon name={"downChevron"} size={24}/>
                    )}
                </div>
            </div>

            {/* 2. Dropdown Panel */}
            {isFocused && (
                <div className="absolute z-10 w-full mt-3 p-3 ">
                    <div className="flex flex-col gap-2 overflow-y-auto max-h-60 scrollbar-none">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((item) => (
                                <Option
                                    key={item.id}
                                    label={`${item.label} (${item?.phone})`}
                                    isSelected={item.id === selectedItem?.id}
                                    onClick={() => handleSelect(item)}
                                />
                            ))
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
