import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import  Grid from '@material-ui/core/Grid';
import  Icon from '@material-ui/core/Icon';
import TextField from '@material-ui/core/TextField';
import debounce from 'debounce';

const styles = theme => ({
 margin: {

 },
 icon: {

 }
});

class Search extends Component {
    constructor(props) {
        super(props);
        this.onChange = debounce(this.onChange, 300);
        this.state = {
            searchTerm: ''
        };
    }

    onChange() {
        if(!this.state.searchTerm || this.state.searchTerm.length > 2)
        this.props.onChange(this.state.searchTerm);
    }

    handleTextFieldChange(e) {
        this.setState({searchTerm: e.target.value});
        this.onChange();
    }

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.margin}>
                <Grid container spacing={8} alignItems="flex-end">
                    <Grid item>
                        <Icon className={classes.icon} color="primary">
                            search
                        </Icon>
                    </Grid>
                    <Grid item>
                        <TextField placeholder="Search" value={this.state.searchTerm} onChange={e => { this.handleTextFieldChange(e)}}/>
                    </Grid>
                </Grid>
            </div>)
    }
}

Search.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Search);