import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import './App.css';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from './components/List';
import Create from './components/Create';


const styles = theme => ({

});

const options = [{
  label: 'Name',
  sortField: 'name',
  sortOrder: 'asc'
}, {
  label: 'Creation Date',
  sortField: 'creationDate',
  sortOrder: 'desc'
}, {
  label: 'Size',
  sortField: 'size',
  sortOrder: 'asc'
}];

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      item: null,
      sortOrder: 'desc',
      sortField: 'creationDate',
      searchTerm: ''
    }
  }

  componentDidMount() {
    this.fetchItems();
  }

  fetchItems() {
        var params = {
            searchTerm: this.state.searchTerm,
            sortOrder: this.state.sortOrder || 'desc',
            sortField: this.state.sortField || 'creationDate'
        };
        var queryString = Object.keys(params).map((key) => {
            if (typeof params[key] !== 'undefined' && params[key] !== null) {
                return key + '=' + encodeURIComponent(params[key]);
            }
        }).filter(item => !!item).join('&');
        fetch(`/api/v1/items${queryString ? '?' + queryString : ''}`)
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

  render() {
    const { classes } = this.props;
    return (
      <Router>
        <div className={classes.root}>
          <Route exact path="/" component={List} />
          <Route path="/create" component={Create} />
          <Route path="/item/:id" component={Create} />
        </div>
      </Router>

    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
