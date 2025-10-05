import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

export default function ActionAreaCard({ img, name, specialty, url }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(url); // navigate to the URL passed via props
  };

  return (
    <Card sx={{ maxWidth: 345, backgroundColor: '#aca6a6ff' }}>
      <CardActionArea onClick={handleClick}>
        <CardMedia
          component="img"
          height="140"
          image={img}
          alt={name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {specialty}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
