import {
  CardMedia,
  TextField,
  Typography,
  Container,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@mui/material';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ja } from 'date-fns/locale';
import { format } from 'date-fns';
import Grid from '@mui/material/GridLegacy';
import { Book } from '../../types';




interface BookDetailProps {
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
}

const BookDetail: React.FC<BookDetailProps> = ({ books, setBooks }) => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();

const book = books.find((book) => book.id === Number(params.id));

// 初期値の準備（nullでもエラーにならんように）
const [value, setValue] = useState<Date | null>(() => {
  if (book?.readDate) {
    return new Date(book.readDate);
  }
  return null;
});
const [memo, setMemo] = useState<string>(book?.memo || '');

if (!book) {
  return <Typography>本が見つかりません</Typography>;
}


  // readDateは文字列なのでDate型に変換
  const initialDate = book.readDate ? new Date(book.readDate) : null;


  const setNewValue = (newValue: Date | null) => {
    if (newValue) {
      setValue(newValue);
    }
  };

  const updateBookInfo = (bookId: number) => {
    const newList = books.map((book) => {
      if (book.id === bookId) {
        return {
          ...book,
          readDate: value ? format(value, 'yyyy/MM/dd') : '',
          memo: memo,
        };
      } else {
        return book;
      }
    });

    setBooks(newList);
    navigate('/');
  };

  return (
    <Container component="section" maxWidth="md" sx={{ mt: 5 }}>
      <Card sx={{ height: '100%' }}>
        <Grid container>
          <Grid item sm={4}>
           <CardMedia component="img" image={book.image} alt={book.title} />
          </Grid>
          <Grid item sm={8}>
            <CardContent>
              <Typography sx={{ mb: 2, fontSize: '18px' }}>{book.title}</Typography>
              <Box sx={{ mb: 2 }}>
                読んだ日
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
  <DatePicker
  label="日付"
  maxDate={new Date()}
  value={value}
  onChange={setNewValue}
  format="yyyy年 MM月"
  slotProps={{
    textField: {
      fullWidth: true, // 必要に応じて
      variant: 'outlined',
    },
  }}
/>
</LocalizationProvider>

              </Box>
              <Box>
                感想:<br />
                <TextField
                  multiline
                  fullWidth
                  rows={8}
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                />
              </Box>
            </CardContent>
            <CardActions>
              <Grid container>
                <Grid item sm={6}>
                  <Button component={Link} to="/" color="secondary" variant="contained">
                    一覧に戻る
                  </Button>
                </Grid>
                <Grid item sm={6}>
                  <Button
                    color="info"
                    variant="contained"
                    onClick={() => updateBookInfo(book.id)}
                  >
                    保存する
                  </Button>
                </Grid>
              </Grid>
            </CardActions>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default BookDetail;
