import {
  Box,
  CardMedia,
  Typography,
  Container,
  Card,
  CardContent,
  Fab,
} from '@mui/material';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import Grid from '@mui/material/GridLegacy';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import { Book } from '../../types';

interface BookDetailProps {
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
}

interface VolumeInfo {
  title?: string;
  description?: string;
  publisher?: string;
  publishedDate?: string;
  imageLinks?: { thumbnail?: string };
}

interface SaleInfo {
  listPrice?: { amount?: number };
  buyLink?: string;
}

interface GoogleBook {
  id?: string;
  volumeInfo?: VolumeInfo;
  saleInfo?: SaleInfo;
}

const BookDetail: React.FC<BookDetailProps> = ({ books, setBooks }) => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [bookInfo, setBookInfo] = useState<GoogleBook | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const didFetch = useRef(false); 
  const id = Number(params.id);
  const book = books.find((b) => b.id === id);
  const [value] = useState<Date | null>(book?.readDate ? new Date(book.readDate) : null);
  const [memo] = useState<string>(book?.memo || '');

  useEffect(() => {
    if (!params.id || didFetch.current) return;
    didFetch.current = true;

    const fetchBookInfo = async () => {
      try {
        setIsLoading(true);
        console.log(`📘 Fetching book info for ID: ${params.id}`);
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${params.id}`
        );
        const data = await response.json();
        setBookInfo(data);
      } catch (error) {
        console.error('書籍情報の取得に失敗しました', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookInfo();
  }, [params.id]); 

  if (isLoading) {
    return (
      <Container sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          書籍情報を取得中です...
        </Typography>
      </Container>
    );
  }

  if (!book && !bookInfo) {
    return <Typography>本の詳細情報が取得できません</Typography>;
  }

  const updateBookInfo = (bookId: number) => {
    const newList = books.map((b) =>
      b.id === bookId
        ? {
            ...b,
            readDate: value ? format(value, 'yyyy/MM/dd') : '',
            memo,
          }
        : b
    );
    setBooks(newList);
    navigate('/');
  };

  const addBook = () => {
    if (!bookInfo || !bookInfo.volumeInfo) return;

    const newId = books.length !== 0 ? books.slice(-1)[0].id + 1 : 1;

    const newBook: Book = {
      id: newId,
      title: bookInfo.volumeInfo.title || '不明',
      description:
        bookInfo.volumeInfo.description
          ?.replace(/<br\s*\/?>/gi, '')
          .replace(/<\/?[^>]+>/g, '') || '不明',
      image:
        bookInfo.volumeInfo.imageLinks?.thumbnail?.replace(/^http:\/\//, 'https://') ||
        '/no-image.png',
      readDate: '',
      memo: '',
    };

    setBooks([...books, newBook]);
    navigate(`/edit/${newId}`);
  };

  const title = bookInfo?.volumeInfo?.title || book?.title || '不明';
  const image =
    bookInfo?.volumeInfo?.imageLinks?.thumbnail?.replace(/^http:\/\//, 'https://') ||
    book?.image?.replace(/^http:\/\//, 'https://') ||
    '/no-image.png';
  const publisher = bookInfo?.volumeInfo?.publisher || '不明';
  const rawDate = bookInfo?.volumeInfo?.publishedDate || '不明';
  const publishedDate = rawDate !== '不明' ? rawDate.replace(/-/g, '/') : rawDate;
  const rawAmount = bookInfo?.saleInfo?.listPrice?.amount;
  const price = rawAmount ? `${rawAmount.toLocaleString('ja-JP')}円` : '不明';
  const rawDescription =
    bookInfo?.volumeInfo?.description || book?.description || '不明';
  const description = rawDescription
    .replace(/<br\s*\/?>/gi, '')
    .replace(/<\/?[^>]+>/g, '');
  const buyLink = bookInfo?.saleInfo?.buyLink;

  const backLink =
    location.state?.fromSearch && typeof location.state.fromSearch === 'string'
      ? `/search${location.state.fromSearch}`
      : '/search';

  return (
    <>
      <Fab
        size="medium"
        color="primary"
        component={Link}
        to={backLink}
        sx={{
          position: 'fixed',
          top: 70,
          left: 16,
          zIndex: 1300,
        }}
      >
        <ArrowBackIcon />
      </Fab>

      <Container component="section" maxWidth="md" sx={{ mt: 6 }}>
        <Card sx={{ height: '100%' }}>
          <Grid container>
            <Grid item sm={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <CardMedia
                component="img"
                image={image}
                alt={title}
                onError={(e) => {
                  e.currentTarget.src = '/no-image.png';
                }}
              />
              <Fab
                size="small"
                color="primary"
                onClick={() => {
                  book ? updateBookInfo(id) : addBook();
                }}
                sx={{ mt: 2 }}
              >
                <AddIcon />
              </Fab>
            </Grid>
            <Grid item sm={8}>
              <CardContent>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  <strong>タイトル：</strong> {title}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>金額：</strong> {price}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  <strong>説明文：</strong> {description}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>出版社：</strong> {publisher}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>出版日：</strong> {publishedDate}
                </Typography>
                {buyLink ? (
                  <a
                    href={buyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: 'blue',
                      textDecoration: 'underline',
                      fontWeight: 'bold',
                      display: 'inline-block',
                      marginTop: '16px',
                    }}
                  >
                    購入はこちら
                  </a>
                ) : (
                  <a
                    style={{
                      color: 'gray',
                      textDecoration: 'none',
                      pointerEvents: 'none',
                      fontStyle: 'italic',
                      display: 'inline-block',
                      marginTop: '16px',
                    }}
                  >
                    購入はこちら
                  </a>
                )}
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      </Container>
    </>
  );
};

export default BookDetail;