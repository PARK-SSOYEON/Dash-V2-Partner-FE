import React, { useState, useMemo, useRef, useEffect } from 'react';
import { cva } from 'class-variance-authority';
import { Option } from './Option';
import { Icon } from '../Icon.tsx';

interface Item {
    id: string;
    label: string;
}

interface MultiDropdownSelectorProps {
    placeholder: string;
    searchPlaceholder: string;
    data: Item[];
    onSelect: (items: Item[]) => void;
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

export const MultiDropdownSelector: React.FC<MultiDropdownSelectorProps> = ({
                                                                                placeholder,
                                                                                searchPlaceholder,
                                                                                data,
                                                                                onSelect,
                                                                            }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItems, setSelectedItems] = useState<Item[]>([]);
    const [isSelectedListOpen, setIsSelectedListOpen] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);

    const isActive = isFocused || selectedItems.length > 0;
    const activeTextClass = isActive ? 'text-(--color-blue-500)' : '';

    // 외부 클릭 시 dropdown close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsFocused(false);
                setIsSelectedListOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // 검색어에 따른 옵션 필터링
    const filteredOptions = useMemo(() => {
        const normalizedQuery = searchTerm.trim().toLowerCase();

        if (normalizedQuery.length === 0) {
            return [];
        }

        return data.filter((item) => item.label.toLowerCase().includes(normalizedQuery));
    }, [data, searchTerm]);

    const toggleItem = (item: Item) => {
        setSelectedItems((prev) => {
            const exists = prev.some((selected) => selected.id === item.id);
            const next = exists
                ? prev.filter((selected) => selected.id !== item.id)
                : [...prev, item];

            onSelect(next);
            return next;
        });

        setSearchTerm('');
    };

    // 메인 인풋에 표시될 라벨
    const selectedCount = selectedItems.length;
    const displayLabel = selectedCount > 0 ? `${selectedCount}개 선택됨` : placeholder;

    // 메인 인풋이 검색 인풋을 보여주는지 여부
    const isSearchActive = isFocused;

    const hasSelection = selectedItems.length > 0;
    const selectedSummaryText = hasSelection
        ? `${selectedItems.length}개의 선택된 항목`
        : '선택항목 없음';

    return (
        <div className="relative w-full" ref={containerRef}>
            {/* 1. Main Input/Display Area */}
            <div
                className={inputContainerVariants({ isActive })}
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
                        <Icon name={"upChevron"} size={24} />
                    ) : (
                        <Icon name={"downChevron"} size={24} />
                    )}
                </div>
            </div>

            {/* 2. Dropdown Panel */}
            {isFocused && (
                <div className="absolute z-10 w-full p-2">
                    {/* 선택 항목 요약 / 토글 영역 */}
                    <div
                        className={`flex justify-start text-base font-light cursor-pointer transition-all duration-200 ${
                            hasSelection
                                ? 'text-(--color-blue-500)'
                                : 'text-black/30'
                        }`}
                        onClick={() => hasSelection && setIsSelectedListOpen((prev) => !prev)}
                    >
                        <span>{selectedSummaryText}</span>
                        <div className="ml-2 flex items-center">
                            {hasSelection && (
                                isSelectedListOpen ? (
                                    <Icon name={"downChevron"} size={20} />
                                ) : (
                                    <Icon name={"rightChevron"} size={20} />
                                )
                            )}
                        </div>
                    </div>

                    {/* 선택된 항목 리스트 */}
                    {isSelectedListOpen && hasSelection && (
                        <div className="mt-2 ml-4 flex flex-col gap-2 overflow-y-auto max-h-40 scrollbar-none">
                            {selectedItems.map((item) => (
                                <Option
                                    key={item.id}
                                    label={item.label}
                                    isSelected={true}
                                    onClick={() => toggleItem(item)}
                                />
                            ))}
                        </div>
                    )}

                    {/* 검색된 옵션 리스트 */}
                    <div className="mt-4 mx-2 flex flex-col gap-2 overflow-y-auto max-h-60 scrollbar-none">
                        {filteredOptions.length > 0 &&
                            filteredOptions.map((item) => (
                                <Option
                                    key={item.id}
                                    label={item.label}
                                    isSelected={selectedItems.some((selected) => selected.id === item.id)}
                                    onClick={() => toggleItem(item)}
                                />
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
};
