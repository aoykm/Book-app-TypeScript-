import { useRef, useState, useEffect } from 'react';
import {
  Box, Button, Container, Fab, TextField, Typography,
  Card, CardContent, Pagination
} from '@mui/material';
import {
  Link,
  useNavigate,
  useLocation,
  useSearchParams,
} from 'react-router-dom';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const itemsPerPage = 12;
  const maxItems = 120;

  const keywordParam = searchParams.get('q') ?? '';
  const pageParam = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    if (keywordParam) {
      if (keyword.current) keyword.current.value = keywordParam;
      setCurrentPage(pageParam);
      fetchBooks(keywordParam, pageParam);
    }
  }, [keywordParam, pageParam]);

  const validateInput = (): boolean => {
    const searchText = keyword.current?.value ?? '';
    const forbiddenPattern = /["'`;#\-\/\*=]/;

    if (!searchText) {
      setError(true);
      setErrorMessage('本のタイトルは必須項目です');
      return false;
    }

    if (forbiddenPattern.test(searchText)) {
      setError(true);
      setErrorMessage('半角記号（"\';-/#*=）は入力できません。');
      return false;
    }

    setError(false);
    setErrorMessage('');
    return true;
  };

  const handleBlur = () => {
    validateInput();
  };

  const fetchBooks = async (searchText: string, page: number) => {
    const startIndex = (page - 1) * itemsPerPage;
    const baseUrl = 'https://www.googleapis.com/books/v1/volumes?';
    const params = {
      q: `intitle:${searchText}`,
      startIndex: startIndex.toString(),
      maxResults: itemsPerPage.toString(),
    };
    const queryParams = new URLSearchParams(params);

    try {
      const response = await fetch(baseUrl + queryParams);
      const data = await response.json();

      const newList: SearchBook[] =
        data.items?.map((book: any) => {
          const id = book.id || '';
          const title = book.volumeInfo?.title || '';
          const img = book.volumeInfo?.imageLinks?.thumbnail || '';
          const description = book.volumeInfo?.description?.slice(0, 40) || '';
          return { id, title, image: img, description };
        }) || [];

      setSearchResult(newList);
      setTotalItems(Math.min(data.totalItems || 0, maxItems));
    } catch (error) {
      console.error('検索APIの取得に失敗しました', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInput()) return;

    const searchText = keyword.current?.value ?? '';
    setCurrentPage(1);
    navigate(`/search?q=${encodeURIComponent(searchText)}&page=1`, { replace: true });
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    const searchText = keyword.current?.value ?? '';
    navigate(`/search?q=${encodeURIComponent(searchText)}&page=${page}`, { replace: true });
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

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <>
      <Container component="section" maxWidth="xl" sx={{ position: 'relative' }}>
        <Fab
          size="medium"
          component={Link}
          to="/"
          sx={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}
        >
          <ArrowBackIcon />
        </Fab>
      </Container>

      <Container component="section" maxWidth="lg">
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h5">
            本を検索
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              required
              label="本のタイトルを入力"
              inputRef={keyword}
              error={error}
              helperText={error ? errorMessage : ''}
              onBlur={handleBlur}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ my: 2 }}
              disabled={error}
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
              <Box sx={{ position: 'relative' }}>
                <Card
                  component={Link}
                  to={`/detail/${card.id}`}
                  state={{ fromSearch: location.search }}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': { transform: 'scale(1.03)', boxShadow: 6 },
                    textDecoration: 'none',
                    paddingBottom: '56px',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      height: 180,
                      backgroundImage: 'url(/images/castle.jpg)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      component="img"
                      src={card.image}
                      alt={card.title}
                      sx={{
                        maxHeight: '100%',
                        maxWidth: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  </Box>

                  <CardContent>
                    <Typography variant="h6">{card.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.description}
                    </Typography>
                  </CardContent>
                </Card>

                <Box sx={{ position: 'absolute', bottom: 8, left: 8 }}>
                  <Fab
                    size="small"
                    color="primary"
                    onClick={(e) => {
                      e.preventDefault();
                      addBook(card);
                    }}
                    sx={{ minHeight: 40, minWidth: 40 }}
                  >
                    <AddIcon />
                  </Fab>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        {totalItems > itemsPerPage && (
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}
      </Container>
    </>
  );
};

export default BookSearch;