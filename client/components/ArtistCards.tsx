import React, { useState } from 'react';
import { IconButtonProps } from '@mui/material/IconButton';
import {
  Box,	Grid,	Card,	CardHeader,	CardMedia,	CardContent,	CardActions,	Collapse,	Typography,	ExpandMoreIcon,	YouTubeIcon,	TwitterIcon,	MusicNoteIcon,	FacebookIcon,	QuizIcon,	InstagramIcon,	LanguageIcon, IconButton, UseTheme, Styled, ArrowBackIosNewIcon, Fab
} from '../styles/material';
import EventCards from './EventCards';
import ArtistBanner from './ArtistBanner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = Styled((props: ExpandMoreProps) => {
  const { ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

interface artistPropsType {
  artistProps: {
  id: number,
  artistName: string,
  bio: string,
  ticketId: string,
  youtube: string,
  twitter: string,
  facebook: string,
  instagram: string,
  itunes: string,
  wiki: string,
  homepage: string,
  image: string,
  },
  resetSingle: ()=>void;
}

const ArtistInfoCard = ({artistProps, resetSingle}: artistPropsType) => {
  const theme = UseTheme();
  const iconColors = theme.palette.secondary.contrastText;
  const inverseMode = theme.palette.secondary.main;
  const navigate = useNavigate();
  const [expanded, setExpanded] = React.useState(false);
  const [events, setEvents] = useState(
    [{
      name: 'No events found',
      image: '/images/patrick-perkins-pay-artists.jpg',
      description: 'There are currently no events found for this artist.',
      id: 1001,
    }]
  );
  const {
    artistName,
    bio,
    facebook,
    homepage,
    image,
    instagram,
    itunes,
    twitter,
    wiki,
    youtube,
  } = artistProps;


  const socials = {
    youtube: [youtube, <YouTubeIcon key={'youtube'} sx={{ color: iconColors }} />],
    twitter: [twitter, <TwitterIcon key={'twitter'} sx={{ color: iconColors }}/>],
    facebook: [facebook, <FacebookIcon key={'fb'} sx={{ color: iconColors }}/>],
    instagram: [instagram, <InstagramIcon key={'insta'} sx={{ color: iconColors }}/>],
    homepage: [homepage, <LanguageIcon key={'homepage'} sx={{ color: iconColors }}/>],
    itunes: [itunes, <MusicNoteIcon key={'music'} sx={{ color: iconColors }}/>],
    wiki: [wiki, <QuizIcon key={'wiki'} sx={{ color: iconColors }}/>],
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const getArtistEvents = (artist: string) => {
    const noSpecialChars: string = artist
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    axios.get('/api/favArtists/events', { params: { keyword: noSpecialChars } })
      .then((responseObj) => {
        setEvents(responseObj.data.events);
      })
      .catch(err => console.error(err));
  };

  const goBack = () => {
    resetSingle();
    navigate('/artists');
  };

  return (
    <Box>
        <Grid container>
        <Box sx={{ position: 'sticky', zIndex: 'tooltip'}}>
      <Fab
        size='small'
        onClick={() => goBack()}
        sx={{
          marginLeft: '25px',
          top: 100,
          right: 'auto',
          bottom: 'auto',
          left: 'inherit',
          position: 'fixed'
        }}>
        <ArrowBackIosNewIcon onClick={() => goBack()} />
      </Fab>
    </Box>
          <ArtistBanner artistDetails={artistProps} />
          <Card sx={{ bgcolor: inverseMode, mt: '40px' }}>
            <CardHeader
              title={artistName}
              sx={{ bgcolor: inverseMode }} />
            <CardMedia
              component="img"
              height="250"
              image={image}
              alt={artistName}
              sx={{ bgcolor: inverseMode }} />
            <CardContent sx={{ bgcolor: inverseMode }}>
              <Typography noWrap variant="body2">
                {bio}
              </Typography>
            </CardContent>
            <CardActions disableSpacing sx={{ bgcolor: inverseMode }}>
              <ExpandMore
                expand={expanded}
                sx={{ color: iconColors }}
                onClick={() => {
                  handleExpandClick();
                  getArtistEvents(artistName);
                } }
                aria-expanded={expanded}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <CardContent id={artistName}>
                <Typography paragraph sx={{ bgcolor: inverseMode }}>Bio:</Typography>
                <Typography paragraph sx={{ bgcolor: inverseMode }}>
                  {bio}
                </Typography>
                <Typography paragraph sx={{ bgcolor: inverseMode }}>Socials:</Typography>
                <Typography>
                  <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2}>
                      {Object.keys(socials).map((social: string, index) => {
                        return (
                          <Grid item key={`social${index}`}>
                            <IconButton>
                              <a href={socials[social][0]}>{socials[social][1]}</a>
                            </IconButton>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                </Typography>
                <Box sx={{ flexGrow: 1 }}>
                  <Grid container spacing={2}>
                    {events.length > 1
                      ? <Grid item id={artistName}>
                        <Typography paragraph sx={{ bgcolor: inverseMode }}>Events:</Typography>
                        {events.map((eventObj, index) => {
                          return <EventCards events={eventObj} key={`event${index}`} />;
                        })}
                      </Grid>
                      : <Typography paragraph sx={{ bgcolor: inverseMode }}>No Upcoming Events</Typography>}
                  </Grid>
                </Box>
              </CardContent>
            </Collapse>
          </Card>
        </Grid>
      </Box>
  );
};

export default ArtistInfoCard;
