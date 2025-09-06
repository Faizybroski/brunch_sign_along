
export interface MerchandiseItem {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  inventory?: number;
  variants?: MerchandiseVariant[];
  active?: boolean;
}

export interface MerchandiseVariant {
  id?: number;
  merchandise_id?: number;
  size: string;
  color: string;
  inventory: number;
  active?: boolean;
}

export interface MerchandiseCategory {
  id: number;
  name: string;
  description?: string;
}
