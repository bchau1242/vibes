import React, { useState, useEffect } from 'react';
import { IconButtonProps } from '@mui/material/IconButton';
import {
  Box,	Grid, Typography,	YouTubeIcon,	TwitterIcon,	MusicNoteIcon,	FacebookIcon,	QuizIcon,	InstagramIcon,	LanguageIcon, IconButton, UseTheme, Styled, Button, ArrowBackIosNewIcon, Fab, purple,
} from '../styles/material';
import EventCards from './ArtistEventCards';
import ArtistBanner from './ArtistBanner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Dropdown from '../components/Dropdown';
interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const fontColor = {
  style: { color: '#a352ff' }
};

const ColorButton = Styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: purple[500],
  '&:hover': {
    backgroundColor: purple[700],
  },
}));
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
  const [ keyword, setKeyword ] = useState('');
  const [allEvents, setAllEvents] = useState([]);
  const [city, setCity] = useState('any');
  const [eventsExist, setEventsExist] = useState(true);
  const [events, setEvents] = useState(
    [{
      name: 'No events found',
      image: '/images/patrick-perkins-pay-artists.jpg',
      description: 'There are currently no events found for this artist.',
      id: 1001,
      city: 'New Orleans'
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

  const removeHref = ()=>{
    const bioArr = bio.split(' ');
    let newBio = '';
    let i = 0;
    while(bioArr[i][0] !== '<'){
      newBio += bioArr[i] + ' ';
      i++;
    }
    newBio = newBio.slice(0, newBio.length - 1);
    console.log(newBio[newBio.length - 1]);
    if(newBio[newBio.length - 1] !== '.'){
      newBio += '.';
    }
    return newBio;
  }


  const socials = {
    youtube: [youtube, <YouTubeIcon key={'youtube'} sx={{ className: 'home-icons' }} />],
    twitter: [twitter, <TwitterIcon key={'twitter'} sx={{ className: 'home-icons' }}/>],
    facebook: [facebook, <FacebookIcon key={'fb'} sx={{ className: 'home-icons' }}/>],
    instagram: [instagram, <InstagramIcon key={'insta'} sx={{ className: 'home-icons' }}/>],
    homepage: [homepage, <LanguageIcon key={'homepage'} sx={{ className: 'home-icons' }}/>],
    itunes: [itunes, <MusicNoteIcon key={'music'} sx={{ className: 'home-icons' }}/>],
    wiki: [wiki, <QuizIcon key={'wiki'} sx={{ className: 'home-icons' }}/>],
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

  useEffect(()=>{
    getArtistEvents(artistName);
  },[])

  const updateEvents = (city) => {
    setCity(city);
    if(city === 'all'){
      setEvents(allEvents);
    } else {
    const filteredEvents = allEvents.filter((event) => {
      return event.venueInfo[0].city === city;
    })
    if(!filteredEvents.length){
      setEvents([...allEvents]);
    } else {
      setEvents([...filteredEvents]);
    }
  }
  }

  return (
      <Box>

          <Box>
            <Grid container>
        <Grid>
          <Box sx={{ position: 'sticky', zIndex: 'tooltip' }}>
            <Fab
              size='small'
              onClick={() => goBack()}
              sx={{
                top: 100,
                right: 'auto',
                bottom: 'auto',
                left: 'inherit',
                position: 'fixed'
              }}>
              <ArrowBackIosNewIcon onClick={() => goBack()} />
            </Fab>
          </Box>
          </Grid>
              <Grid xs={12} sm={8}>
                <Typography variant="body1" align="left">
                  {removeHref()}
                </Typography>
              </Grid>
              <Grid xs={12} sm={4}>
                <Typography>
                  <div className="socials">
                      {Object.keys(socials).map((social: string, index) => {
                        return (
                          <div key={`social${index}`} className="socials">
                            <IconButton className="socials">
                              <a href={socials[social][0]}>{socials[social][1]}</a>
                            </IconButton>
                          </div>
                        );
                      })}
                    </div>
                </Typography>
              </Grid>
            </Grid>

            <Grid>
              <Box sx={{ flexGrow: 1 }}>
                <Grid container>
                  {events.length > 1
                    ? <><Typography variant="h2">Events:</Typography><Grid container id={artistName}>
                      {events.map((eventObj, index) => {

                        return (
                          <Grid item xs={12} md={6}>
                            <EventCards events={eventObj} key={`event${index}`} />
                          </Grid>);
                      })}
                    </Grid></>
                    : <Typography paragraph sx={{ color: inverseMode }}>No Upcoming Events</Typography>}
                </Grid>
              </Box>
            </Grid>
          </Box>
      </Box>

  );
};
export default ArtistInfoCard;
