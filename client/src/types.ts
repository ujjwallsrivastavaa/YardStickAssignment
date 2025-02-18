export interface Category {
  _id: string;
  name: string;
}

export interface Transaction {
  _id: string;
  amount: number;
  category: Category;
  description: string;
  date: string;
  __v: number;
}

export interface Budget {
  _id: string;
  amount: number;
  category: Category;
  description: string;
  month: string;
  __v: number;
}