import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ErrorIcon from '@material-ui/icons/Error';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/types';
import { toggleUIOption } from 'store/uiSlice';

const useStyles = makeStyles((theme) => ({
  title: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
  details: {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.contrastText,
  },
}));

const Validation = () => {
  const dispatch = useDispatch();
  const validationExpanded = useSelector(
    (state: RootState) => state.ui.validationExpanded
  );
  const classes = useStyles();
  const units = Object.values(useSelector((state: RootState) => state.roster.units));

  const warnings = [];
  for (const unit of units) {
    if (unit.points > 12)
      warnings.push([unit.name, 'No Unit may cost more than 12 points!']);
    if (unit.name !== 'Unit' && unit.points < 1)
      warnings.push([unit.name, 'No Unit may cost less than one point!']);
    if (unit.xenosRules.includes('Fanatical Discipline') && unit.stats.courage < 3)
      warnings.push([unit.name, 'This unit can´t have less than 3 courage!']);
    if (unit.xenosRules.includes('Hive Mind') && unit.xenosRules.includes('Commander'))
      warnings.push([unit.name, 'A Commander can´t have Hive Mind!']);
    if (unit.xenosRules.includes('Slow') && unit.options.includes('Mobile'))
      warnings.push([unit.name, 'Slow and Mobile can´t be used together!']);
  }

  return (
    <>
      {warnings.length !== 0 && (
        <Accordion
          expanded={validationExpanded}
          onChange={() => dispatch(toggleUIOption('validationExpanded'))}
          style={{ maxWidth: 1210 }}
        >
          <AccordionSummary
            className={classes.title}
            expandIcon={<ExpandMoreIcon className={classes.title} />}
          >
            <Typography variant="h5">Warnings</Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.details}>
            <List>
              {warnings.map(([name, text], index) => (
                <ListItem key={index}>
                  <ListItemIcon className={classes.details}>
                    <ErrorIcon />
                  </ListItemIcon>
                  <ListItemText primary={name} secondary={text} />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      )}
    </>
  );
};

export default Validation;
