import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import SortIcon from '@material-ui/icons/Sort';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import CheckIcon from '@material-ui/icons/Check';

import Search from './Search';

import Chip from '@material-ui/core/Chip';
import { ListItemSecondaryAction } from '../../node_modules/@material-ui/core';


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
    fab: {
        position: 'fixed',
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2
    }
});

const ITEM_HEIGHT = 48;

const options = [{
    label: 'Name',
    sortField: 'name',
    sortOrder: 'asc'
}, {
    label: 'Creation Date',
    sortField: 'creationDate',
    sortOrder: 'desc'
}];

class List extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: [],
            anchorEl: null,
            sortOrder: 'desc',
            sortField: 'creationDate',
            searchTerm: ''
        }
    }

    componentDidMount() {
        this.fetchItems();
    }

    toggleSortOrder(option) {
        if(option.sortOrder === 'asc') {
            option.sortOrder = 'desc';
        } else {
            option.sortOrder = 'asc';
        }
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

    handleSearchTermChange(searchTerm) {
        this.setState({searchTerm: searchTerm});
        this.fetchItems();
    }

    handleAddClick() {
        this.props.history.push('/create');
    }

    handleOpenSortMenu = (event) => {
        this.setState({ anchorEl: event.currentTarget});   
    };
    handleCloseSortMenu = (event) => {
        this.setState({ anchorEl: null});
    };
    handleSortClick = (option) => {
        console.log(option);
        if(option.sortField === this.state.sortField) {
            this.toggleSortOrder(option);
        }
        this.setState({sortField:  option.sortField, sortOrder: option.sortOrder});
        this.fetchItems();
    };

    renderSortOrder(option) {
        if(option.sortOrder === 'asc') {
            return(<ListItemIcon><ArrowUpwardIcon /></ListItemIcon>);
        }
        return (<ListItemIcon><ArrowDownwardIcon /></ListItemIcon>);
    }

    renderSelectedSort(option) {
        if(this.state.sortField === option.sortField) {
            return (<ListItemSecondaryAction><CheckIcon /></ListItemSecondaryAction>);
        }
    }

    render() {
        const { classes } = this.props;
        const { anchorEl } = this.state;
        //const {items} = this.state;
        return (
            <div className={classes.root}>
                <AppBar position="sticky" color="default">
                    <Toolbar>
                        <Search onChange={(searchTerm) => this.handleSearchTermChange(searchTerm)}></Search>
                        <IconButton
                            aria-label="Sort"
                            aria-owns={anchorEl ? 'long-menu' : null}
                            aria-haspopup="true"
                            onClick={this.handleOpenSortMenu}
                        >

                            <SortIcon />
                        </IconButton>
                        <Menu
                            id="long-menu"
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={this.handleCloseSortMenu}
                            PaperProps={{
                                style: {
                                    maxHeight: ITEM_HEIGHT * 4.5,
                                    width: 240,
                                },
                            }}
                        >
                            {options.map(option => (
                                <MenuItem key={option.sortField} onClick={this.handleSortClick.bind(this, option)}>
                                    {this.renderSortOrder(option)}
                                    <ListItemText>{option.label}</ListItemText>
                                    {this.renderSelectedSort(option)}
                                </MenuItem>
                            ))}
                        </Menu>
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
                <Button variant="fab" color="primary" aria-label="Add" className={classes.fab} onClick={this.handleAddClick.bind(this)}>
                    <AddIcon />
                </Button>
            </div>
        );
    }
}

List.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(List);
