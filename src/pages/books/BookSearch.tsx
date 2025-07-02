import { useRef, useState } from 'react';
import {
  Box, Button, Container, Fab, TextField, Typography,
  Card, CardMedia, CardContent, CardActions
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/GridLegacy';
import { Book, SearchBook } from '../../types';

interface Props {
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
}

const BookSearch: React.FC<Props> = ({ books, setBooks }) => {
  const keyword = useRef<HTMLInputElement>(null);
  const [searchResult, setSearchResult] = useState<SearchBook[]>([]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    const searchText = keyword.current?.value;

    if (!searchText) {
      setError(true);
      setErrorMessage('本のタイトルは必須項目です');
      return;
    }
    const forbiddenPattern = /["'`;#\-\/\*=]/;
  if (forbiddenPattern.test(searchText)) {
    setError(true);
    setErrorMessage('半角記号（"\';-/#*=）は入力できません。');
    return;
  }

    setError(false);
    setErrorMessage('');

    const baseUrl = 'https://www.googleapis.com/books/v1/volumes?';
    const params = { q: `intitle:${searchText}`, maxResults: '40' };
    const queryParams = new URLSearchParams(params);

    const response = await fetch(baseUrl + queryParams);
    const data = await response.json();

    const newList: SearchBook[] = data.items?.map((book: any) => {
      const title = book.volumeInfo?.title || '';
      const img = book.volumeInfo?.imageLinks?.thumbnail || '';
      const description = book.volumeInfo?.description?.slice(0, 40) || '';
      return {
        title,
        image: img,
        description,
      };
    }) || [];

    setSearchResult(newList);
  };

  const addBook = (card: SearchBook) => {
    const newId = books.length !== 0 ? books.slice(-1)[0].id + 1 : 1;
    const newBook: Book = {
      id: newId,
      title: card.title,
      description: card.description,
      image: card.image,
      readDate: '',
      memo: '',
    };
    setBooks([...books, newBook]);
    navigate(`/edit/${newId}`);
  };
  

  return (
    <>
      <Container component="section" maxWidth="xl">
        <Fab size="medium" component={Link} to="/" sx={{ mt: 1, ml: 1 }}>
          <ArrowBackIcon />
        </Fab>
      </Container>

      <Container component="section" maxWidth="lg">
        <Box
          sx={{
            mt: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Typography component="h1" variant="h5">本を検索</Typography>
          <Box component="form" onSubmit={search} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="本のタイトルを入力"
              name="search"
              inputRef={keyword}
              error={error}
              helperText={error ? errorMessage : ''}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ my: 2 }}
            >
              検索する
            </Button>
          </Box>
        </Box>
      </Container>

      <Container component="section" maxWidth="lg">
        <Grid container spacing={4}>
          {searchResult.map((card, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%' }}>
                <Grid container>
                  <Grid item sm={4}>
                    <CardMedia
                      component="img"
                      image={card.image}
                      alt={card.title}
                    />
                  </Grid>
                  <Grid item sm={8}>
                    <CardContent>
                      <Typography sx={{ fontSize: '16px' }}>
                        {card.title}
                      </Typography>
                      <Typography sx={{ fontSize: '14px', mb: 1.5 }} color="text.secondary">
                        {card.description}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Fab color="primary" onClick={() => addBook(card)}>
                        <AddIcon />
                      </Fab>
                    </CardActions>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default BookSearch;
