import { useState, useEffect, Dispatch, SetStateAction } from 'react';



export const usePersist = <T,>(
  STORAGE_KEY: string
): [
  T[],
  Dispatch<SetStateAction<T[]>>,
  string,
  Dispatch<SetStateAction<string>>
] => {
  const save = localStorage.getItem(STORAGE_KEY);
  const initialValue = save ? (JSON.parse(save) as T[]) : [];

  const [books, setBooks] = useState<T[]>(initialValue);
  const [newBook, setNewBook] = useState<string>('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    // eslint-disable-next-line
  }, [books]);

  return [books, setBooks, newBook, setNewBook];
};
