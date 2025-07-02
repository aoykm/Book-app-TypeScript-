import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Container,
  Fab,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
} from '@mui/material';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import Grid from '@mui/material/GridLegacy';
import { Book } from '../../types';




interface BookIndexProps {
  books: Book[];
}

const BookIndex: React.FC<BookIndexProps> = ({ books }) => {
  const navigate = useNavigate();

  const goToSearch = () => {
    navigate('/search');
  };

  const goToEdit = (id: number) => {
    navigate(`/edit/${id}`);
  };

  return (
    <>
      <Container component="section" maxWidth="xl" sx={{ my: 2 }}>
        <Button color="secondary" variant="contained" onClick={goToSearch}>
          検索する
        </Button>
      </Container>
      <Container component="search" maxWidth="lg">
        <Grid container spacing={4}>
          {books.map((card, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%' }}>
                <Grid container>
                  <Grid item sm={4}>
                    <CardMedia component="img" image={card.image} alt={card.title} />
                  </Grid>
                  <Grid item sm={8}>
                    <CardContent>
                      <Typography sx={{ fontSize: '16px' }}>タイトル: {card.title}</Typography>
                      <Typography sx={{ fontSize: '14px', mb: 1.5 }}>
                        読んだ日: {card.readDate}
                      </Typography>
                      <Typography sx={{ fontSize: '14px', mb: 1.5 }}>感想: {card.memo}</Typography>
                    </CardContent>
                    <CardActions>
                      <Fab color="primary" onClick={() => goToEdit(card.id)}>
                        <ModeEditIcon />
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

export default BookIndex;
