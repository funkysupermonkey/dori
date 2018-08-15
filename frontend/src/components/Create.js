import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Switch, AppBar, Toolbar, IconButton, FormControlLabel, TextField, Button, GridList, GridListTile } from '@material-ui/core';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
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
    gridList: {
        maxWidth: '500px'
    }
});

class Create extends Component {
    constructor(props) {
        super(props);
        console.log(process.env.PUBLIC_URL);
        this.state = {
            item: {
                _id: null,
                name: '',
                size: '',
                amount: 0,
                images: [],
                thumbs: [],
                donor: '',
                rental: false
            }
        };
        if (this.props.match && this.props.match.params.id) {
            this.fetchItem(this.props.match.params.id).then((item) => {
                this.setState((prevState) => {
                    return {
                        item: {
                           _id: item._id,
                           name: item.name || prevState.item.name,
                           size: item.size || prevState.item.size,
                           amount: item.amount != null ? item.amount : prevState.item.amount,
                           images: item.images,
                           thumbs: item.thumbs,
                           donor: item.donor || prevState.item.donor,
                           rental: item.rental
                        }
                    }
                });
            })
        }
    }

    fetchItem(id) {
        return fetch(`/api/v1/items/${id}`)
            .then(res => res.json(), (err) => {
                console.error(err.message);
            });
    }

    handleNavigateBack() {
        this.props.history.push('/');
    }

    handleChange = name => event => {
        let value = event.target.value;
        this.setState(prevState => ({
            item: {
                ...prevState.item,
                [name]: value
            }
        }));
    };

    handleCheckedChange = name => event => {
        let checked = event.target.checked;
        this.setState(prevState => ({
            item: {
                ...prevState.item,
                [name]: checked
            }
        }));
    }

    handleSave(event) {
        const {item} = this.state;
        if(!item._id) {
        fetch('/api/v1/items', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        }).then((() => {
            this.props.history.push('/');
        }));
        } else {
            fetch(`/api/v1/items/${item._id}`, {
                method: 'PUT',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
            }).then(() => {

            });
        }
        event.preventDefault();
    }

    handleUpload(event) {
        let data = new FormData();
        data.append('file', event.target.files[0]);
        fetch('/api/v1/upload', {
            method: 'POST',
            body: data
        }).then(res => res.text()).then((response) => {
            this.setState(prevState => ({
                item: {
                    ...prevState.item,
                    images: [response, ...prevState.images]
                }
            }));
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
                                value={this.state.item.name}
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
                                value={this.state.item.size}
                                onChange={this.handleChange('size')}
                                margin="normal"
                                className={classes.control}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="amount"
                                label="Amount"
                                value={this.state.item.amount}
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
                                value={this.state.item.donor}
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
                                        checked={this.state.item.rental}
                                        onChange={this.handleCheckedChange('rental')}
                                    />
                                }
                                label="Rental"
                                className={classes.control} />
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" className={classes.control} color="primary" variant="contained">Save</Button>
                        </Grid>
                        <input id="photo" type="file" className={classes.photoInput} onChange={this.handleUpload.bind(this)} />
                        <label htmlFor="photo">
                            <Button variant="fab" color="secondary" aria-label="Photo" className={classes.photo}>
                                <PhotoCameraIcon />
                            </Button>
                        </label>
                    </Grid>
                </ValidatorForm>
                <GridList cellHeight={180} className={classes.gridList}>
                    {this.state.item.thumbs.map(img => (
                        <GridListTile key={img}>
                            <img src={'/' + process.env.PUBLIC_URL + img} />
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