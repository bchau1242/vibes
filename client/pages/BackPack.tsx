import React, { useEffect, useContext, useCallback, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { styled } from '@mui/material/styles';
import moment from 'moment';
import {
  ArrowForwardIosSharpIcon,
  MuiAccordion,
  MuiAccordionSummary,
  MuiAccordionDetails,
  Typography,
  List,
  ListItem,
  Button,
} from '../styles/material';
import BudgetItem from './BudgetItem';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
const Accordion = styled((props) => (
  <MuiAccordion children={''} disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const formatCurrency = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const BackPack: React.FC = () => {
  const globalData = useContext(UserContext);
  console.log('global data here', globalData);
  let { currentUserInfo } = globalData;

  const [userEvents, setUserEvents] = useState([]);
  const [expanded, setExpanded] = React.useState('panel1');

  const theme = useTheme();
  const iconColors = theme.palette.secondary.contrastText;
  const inverseMode = theme.palette.secondary.main;
  // <YouTubeIcon key={'youtube'} sx={{ color: iconColors }} />
  // <CardContent sx={{ bgcolor: inverseMode }}></CardContent>
  // <Typography paragraph sx={{ bgcolor: inverseMode }}></Typography>
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  //console.log('currentUserInfo', currentUserInfo);
  useEffect(() => {
    getUserEvents();
  }, []);

  const getUserEvents = () => {
    axios
      .get(`/api/profile/events/${currentUserInfo.id}`)
      .then(({ data }) => {
        console.log(data);
        setUserEvents(data);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div>
      {userEvents.map((event, index) => {
        return (
          <EventItem
            event={event}
            // SAMPLE_BUDGET_LIST={SAMPLE_BUDGET_LIST}
            index={index}
            inverseMode={inverseMode}
            expanded={expanded}
            key={index}
            handleChange={handleChange}
          />
        );
      })}
    </div>
  );
};

const EventItem = function ({
  event,
  index,

  inverseMode,
  expanded,
  handleChange,
}) {
  const SAMPLE_BUDGET_LIST = [
    { id: 1, name: 'Tickets' },
    { id: 2, name: 'Food' },
    { id: 3, name: 'Drinks' },
    { id: 4, name: 'Parking' },
    { id: 5, name: 'Merch' },
    { id: 6, name: 'Travel' },
  ];
  const [budgetList, setBudgetList] = React.useState([...SAMPLE_BUDGET_LIST]);
  const handleBudgetChange = (value, index) => {
    const newList = [...budgetList];
    newList[index]['value'] = parseInt(value, 10);
    setBudgetList(newList);
  };

  const totalSum = budgetList.reduce(
    (prev, curr) => prev + (curr?.value ?? 0),
    0
  );

  const handleSubmit = async () => {
    const url = `api/events/budgetsubmit`;

    try {
      axios
        .post(url, budgetList)
        .then((resp) => console.log('Successful budget'))
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div key={index}>
      <Accordion
        sx={{ bgcolor: inverseMode }}
        expanded={expanded === `panel${index + 1}`}
        onChange={handleChange(`panel${index + 1}`)}
      >
        <AccordionSummary
          sx={{ bgcolor: inverseMode }}
          aria-controls='panel1d-content'
          id='panel1d-header'
        >
          <Typography>{event.name}</Typography>
          <Typography sx={{ justifyContent: 'flex-end' }}>
            {event.dates.start.localDate}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ bgcolor: inverseMode }}>
          {budgetList?.map((item, index) => {
            return (
              <BudgetItem
                key={index}
                label={item.name}
                eventId={item.id}
                value={item.value}
                onChange={(e) => handleBudgetChange(e.target.value, index)}
              />
            );
          })}
          <>
            <div margin-top='20px'>
              <Typography>
                Total: ${totalSum ? formatCurrency(totalSum) : 0}
              </Typography>
            </div>
            <Button onClick={handleSubmit}>Submit Budget</Button>
          </>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default BackPack;
