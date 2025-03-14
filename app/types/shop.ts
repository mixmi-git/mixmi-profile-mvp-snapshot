/**
 * Interface for a shop item
 */
export interface ShopItemType {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  link: string;
}

/**
 * Props interface for the ShopSection component
 */
export interface ShopSectionProps {
  items: ShopItemType[];
  onAddItem?: () => void;
  onRemoveItem?: (index: number) => void;
  onItemChange?: (index: number, field: keyof ShopItemType, value: string) => void;
  viewOnly?: boolean;
} 