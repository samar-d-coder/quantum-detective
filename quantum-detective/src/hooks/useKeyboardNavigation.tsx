import { useEffect, useRef, useState } from 'react';

interface UseKeyboardNavigationProps {
  items: string[];
  onSelect: (index: number) => void;
  enabled?: boolean;
}

export const useKeyboardNavigation = ({ 
  items, 
  onSelect, 
  enabled = true 
}: UseKeyboardNavigationProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex(prev => {
            const next = (prev + 1) % items.length;
            itemRefs.current[next]?.focus();
            return next;
          });
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex(prev => {
            const next = prev === 0 ? items.length - 1 : prev - 1;
            itemRefs.current[next]?.focus();
            return next;
          });
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          onSelect(selectedIndex);
          break;
        case 'Escape':
          event.preventDefault();
          itemRefs.current[selectedIndex]?.blur();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enabled, selectedIndex, items.length, onSelect]);

  const setRef = (index: number) => (ref: HTMLButtonElement | null) => {
    itemRefs.current[index] = ref;
  };

  const getItemProps = (index: number) => ({
    ref: setRef(index),
    tabIndex: selectedIndex === index ? 0 : -1,
    'data-selected': selectedIndex === index,
    className: selectedIndex === index ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
  });

  return {
    selectedIndex,
    setSelectedIndex,
    getItemProps
  };
};