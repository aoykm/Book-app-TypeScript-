export interface Book {
  id: number;
  title: string;
  image: string;
  readDate: string;
  memo: string;
  description: string;
}

export interface SearchBook {
  id: string;
  title: string;
  image: string;
  description: string;
}
