import {
  CardMedia,
  Typography,
  Container,
  Card,
  CardContent,
  CardActions,
  Button,
  Fab,
} from '@mui/material';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ja } from 'date-fns/locale';
import { format } from 'date-fns';
import Grid from '@mui/material/GridLegacy';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Book } from '../../types';

interface BookDetailProps {
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
}

interface VolumeInfo {
  title: string;
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
  volumeInfo: VolumeInfo;
  saleInfo: SaleInfo;
}

const BookDetail: React.FC<BookDetailProps> = ({ books, setBooks }) => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bookInfo, setBookInfo] = useState<GoogleBook | null>(null);

  const id = Number(params.id); 
  const book = books.find((b) => b.id === id);

  const [value, setValue] = useState<Date | null>(() =>
    book?.readDate ? new Date(book.readDate) : null
  );
  const [memo, setMemo] = useState<string>(book?.memo || '');

  useEffect(() => {
    const fetchBookInfo = async () => {
      try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${params.id}`);
        const data = await response.json();
        setBookInfo(data);
      } catch (error) {
        console.error('書籍情報の取得に失敗しました', error);
      }
    };

    if (params.id) {
      fetchBookInfo();
    }
  }, [params.id]);

  if (!book && !bookInfo) {
    return <Typography>本の詳細情報が取得できません</Typography>;
  }

  const updateBookInfo = (bookId: number) => {
    const newList = books.map((b) => {
      if (b.id === bookId) {
        return {
          ...b,
          readDate: value ? format(value, 'yyyy/MM/dd') : '',
          memo,
        };
      }
      return b;
    });

    setBooks(newList);
    navigate('/');
  };

  const title = bookInfo?.volumeInfo?.title || book?.title || 'タイトル不明';
  const image =
    bookInfo?.volumeInfo?.imageLinks?.thumbnail?.replace(/^http:\/\//, 'https://') ||
    book?.image?.replace(/^http:\/\//, 'https://') ||
    '/no-image.png';

  const publisher = bookInfo?.volumeInfo?.publisher || '不明';
  const publishedDate = bookInfo?.volumeInfo?.publishedDate || '不明';
  const price = bookInfo?.saleInfo?.listPrice?.amount
    ? `${bookInfo.saleInfo.listPrice.amount}円`
    : '不明';
  const description = bookInfo?.volumeInfo?.description || book?.description || '説明なし';
  const buyLink = bookInfo?.saleInfo?.buyLink;

  return (
    <>
      <Fab
        size="medium"
        color="primary"
        component={Link}
        to="/search"
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
            <Grid item sm={4}>
              <CardMedia
                component="img"
                image={image}
                alt={title}
                onError={(e) => {
                  e.currentTarget.src = '/no-image.png';
                }}
              />
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
                {buyLink && (
                  <a
                  href={buyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: 'green',
                   textDecoration: 'underline',
                   fontWeight: 'bold',
                   display: 'inline-block',
                   marginTop: '16px'
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