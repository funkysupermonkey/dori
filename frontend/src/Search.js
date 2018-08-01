import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import  Grid from '@material-ui/core/Grid';
import  Icon from '@material-ui/core/Icon';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
 margin: {

 },
 icon: {

 }
});

class Search extends Component {
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
                        <TextField id="input-with-icon-grid" label="With a grid" />
                    </Grid>
                </Grid>
            </div>)
    }
}

Search.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Search);