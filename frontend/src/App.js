import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import './App.css';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from './components/List';
import Create from './components/Create';


const styles = theme => ({

});

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {

  }

  render() {
    const { classes } = this.props;
    //const {items} = this.state;
    return (
      <Router>
        <div className={classes.root}>
          <Route exact path="/" component={List} />
          <Route path="/create" component={Create} />
        </div>
      </Router>

    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
