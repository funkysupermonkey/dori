import React, { Component } from 'react';
import './App.css';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Typography from '@material-ui/core/Typography';
import ListSubheader from '@material-ui/core/ListSubheader';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import Search from './Search';

import Chip from '@material-ui/core/Chip';
import Badge from '@material-ui/core/Badge';
import Grid from '@material-ui/core/Grid';


const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    maxWidth: '500px',
    height: 'auto',
  },
});

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    }
  }

  componentDidMount() {
    fetch("/api/v1/items")
      .then(res => res.json())
      .then(
      (result) => {
        this.setState({
          isLoaded: true,
          items: result
        });
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
        this.setState({
          isLoaded: true,
          error,
          items: []
        });
      }
      )
  }

  renderRentalChip(item) {
    const { classes } = this.props;
    if (item.rental) {
      return (<Chip label="Rental" className={classes.chip} />)
    }
  }

  render() {
    const { classes } = this.props;
    //const {items} = this.state;
    return (
      <div className={classes.root}>
        <AppBar position="sticky" color="default">
        <Toolbar>
          <Search></Search>
        </Toolbar>
      </AppBar>
        <GridList cellHeight={180} className={classes.gridList}>
         {this.state.items.map(item => (
          <GridListTile key={item._id}>
            <img src={process.env.PUBLIC_URL + "/images/IMG_1953.JPG"} alt={item.name} />
            <GridListTileBar
              title={item.name}
              subtitle={<span>{item.size}</span>}
            />
          </GridListTile>
        ))}
      </GridList>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
