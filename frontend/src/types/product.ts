
export interface Product {
  id: number;
  name: string;
  barcode: string;
  description: string | null;
  costPrice: string;
  salePrice: string;
  stock: number;
  minStock: number;
  active: boolean;
  categoryId: number;
  category: {
    id: number;
    name: string;
  };
}
