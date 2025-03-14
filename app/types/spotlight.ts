/**
 * Interface for a spotlight or project item
 */
export interface SpotlightItemType {
  id: string;
  title: string;
  description: string;
  image: string;
  link?: string;
  linkText?: string;
}

/**
 * Props interface for the SpotlightSection component
 */
export interface SpotlightSectionProps {
  items: SpotlightItemType[];
  description?: string;
  onAddItem?: () => void;
  onRemoveItem?: (index: number) => void;
  onItemChange?: (index: number, field: keyof SpotlightItemType, value: string) => void;
  viewOnly?: boolean;
} 