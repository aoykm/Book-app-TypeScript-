export interface Book {
  id: number;
  title: string;
  image: string;
  readDate: string;
  memo: string;
  description: string;
}

export interface SearchBook {
  title: string;
  image: string;
  description: string;
}
