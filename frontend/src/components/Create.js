import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Switch, AppBar, Toolbar, IconButton, FormControlLabel, TextField, Button, GridList, GridListTile } from '@material-ui/core';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import { withRouter } from 'react-router-dom';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';


const styles = theme => ({
    margin: {

    },
    photoInput: {
        display: 'none'
    },
    photo: {
        position: 'fixed',
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2
    },
    control: {
        margin: theme.spacing.unit * 2,
    },
});

class Create extends Component {
    constructor(props) {
        super(props);
        this.state = {
                name: '',
                size: '',
                amount: 0,
                images: [],
                donor: '',
                rental: false
            };
    }

    handleNavigateBack() {
        this.props.history.push('/');
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    handleCheckedChange = name => event => {
        this.setState({
            [name]: event.target.checked,
        });
    }

    handleSave(event) {
        fetch('/api/v1/items', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        }).then((() => {
            this.props.history.push('/');
        }));
        event.preventDefault();
    }

    handleUpload(event) {
        let data = new FormData();
        data.append('file', event.target.files[0]);
        fetch('/api/v1/upload', {
            method: 'POST',
            body: data
        }).then((response) => {
            console.log(response);
            let images = [response].concat(this.state.images);
            this.setState({images});
            console.log(this.state);
        }).catch(reason => console.log(reason));
        event.preventDefault();
    }

    render() {
        console.log('Create -> render');

        const { classes } = this.props;
        return (
            <div>
                <AppBar position="sticky" color="default">
                    <Toolbar>
                        <IconButton className={classes.button} aria-label="Back" onClick={this.handleNavigateBack.bind(this)}>
                            <NavigateBeforeIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <ValidatorForm ref="item" onSubmit={this.handleSave.bind(this)}>
                    <Grid direction="row" container spacing={16}>
                        <Grid item xs={12} md={6}>
                            <TextValidator
                                name="name"
                                className="name"
                                label="Name"
                                className={classes.textField}
                                value={this.state.name}
                                onChange={this.handleChange('name')}
                                margin="normal"
                                className={classes.control}
                                required
                                validators={['required', 'minStringLength:3']}
                                errorMessages={['This field is required.', 'Please enter at least 3 chars']}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="size"
                                label="Size"
                                className={classes.textField}
                                value={this.state.size}
                                onChange={this.handleChange('size')}
                                margin="normal"
                                className={classes.control}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="amount"
                                label="Amount"
                                value={this.state.amount}
                                onChange={this.handleChange('amount')}
                                type="number"
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                margin="normal"
                                className={classes.control}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="donor"
                                label="Donors"
                                value={this.state.donor}
                                onChange={this.handleChange('donor')}
                                className={classes.textField}
                                margin="normal"
                                className={classes.control}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        name="rental"
                                        checked={this.state.rental}
                                        onChange={this.handleCheckedChange('rental')}
                                    />
                                }
                                label="Rental"
                                className={classes.control} />
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" className={classes.control} color="primary" variant="contained">Save</Button>
                        </Grid>
                        <input id="photo" type="file" className={classes.photoInput}  onChange={this.handleUpload} />
                        <label htmlFor="photo">
                            <Button variant="fab" color="secondary" aria-label="Photo" className={classes.photo}>
                                <PhotoCameraIcon />
                            </Button>
                        </label>
                    </Grid>
                </ValidatorForm>
                <GridList cellHeight={180}>
                    {this.state.images.map(img => (
                        <GridListTile key={img}>
                            <img src={process.env.PUBLIC_URL + img} />
                        </GridListTile>
                    ))}
                </GridList>
            </div>
        );
    }
}

Create.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Create);