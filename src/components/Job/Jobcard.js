import React from "react";
import { Box, Grid, Button, Typography, makeStyles } from "@material-ui/core";
import { differenceInMinutes } from 'date-fns'
import { useState, useEffect } from "react";
const useStyles = makeStyles((theme) => ({
    wrapper: {
        border: "1px solid #e8e8e8",
        cursor: "pointer",
        transition: '.3s',
        "&:hover": {
            boxShadow: "0px 5px 25px rgba(0, 0, 0, 0.1)",
            borderLeft: "6px solid #4D64E4",
        },
    },
    companyName: {
        fontSize: "13.5px",
        backgroundColor: theme.palette.primary.main,
        padding: theme.spacing(0.75),
        borderRadius: "5px",
        display: "inline-block",
        fontWeight: 600,
    },
    skillChip: {
        margin: theme.spacing(0.5),
        padding: theme.spacing(0.75),
        fontSize: "14.5px",
        borderRadius: "5px",
        fontWeight: 600,
        backgroundColor: theme.palette.secondary.main,
        color: "#fff",
    },
}));

export default (props) => {
    const classes = useStyles();
    const handleDelete = async () => {

        try {
            const apiUrl = `https://painful-dolls-production.up.railway.app/todo/${props.id}`;

            const response = await fetch(apiUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // Handle successful deletion
                props.setJobs((prevJobs) => prevJobs.filter(job => job.id !== props.id));
                console.log('Item deleted successfully');
            } else {
                // Handle errors
                console.error('Error deleting item:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting item:', error.message);
        }
    };

    return (

        <Box p={2} className={classes.wrapper}>
            <Grid container alignItems="center">
                <Grid item xs>
                    <Typography variant="subtitle1" >{props.title}</Typography>
                    <Typography className={classes.companyName} variant="subtitle1" >{props.companyName}</Typography>
                </Grid>
                <Grid item container xs>
                    {props.skills.map((skills) => (
                        <Grid key={skills} className={classes.skillChip} item>
                            {skills}
                        </Grid>
                    ))}
                </Grid>
                <Grid item container direction="column" alignItems="flex-end" xs>
                    <Grid item>
                        <Typography variant="caption">
                            {differenceInMinutes(Date.now(), props.postedOn)-330} min ago | {props.type} | {props.location}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Box mt={2}>
                            <Button onClick={props.open} variant="outlined">Check</Button>
                            <Button style={{ marginLeft: '10px' }} onClick={handleDelete} variant="outlined">Delete</Button>
                        </Box>

                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};