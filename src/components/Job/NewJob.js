import React, { useState } from "react";
import {
    Box,
    Grid,
    FilledInput,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    Button,
    makeStyles,
    DialogContent,
    DialogActions,
    IconButton,
    Typography,
    CircularProgress,
} from "@material-ui/core";

import { Close as CloseIcon } from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({

    skillChip: {
        margin: theme.spacing(0.5),
        padding: theme.spacing(0.75),
        fontSize: "14.5px",
        borderRadius: "5px",
        fontWeight: 600,
        border: `1px solid ${theme.palette.secondary.main}`,
        color: theme.palette.secondary.main,
        cursor: "pointer",

        "&:hover": {
            backgroundColor: theme.palette.secondary.main,
            color: "#fff",
        },
    },
    included: {
        backgroundColor: theme.palette.secondary.main,
        color: "#fff",
    }
}));

const initState={
    title: "",
    type: "Full time",
    companyName: "",
    companyUrl: "",
    location: "Remote",
    link: "",
    description: "",
    skills: [],
}

export default (props) => {
    const [loading, setLoading] = useState(false)
    const [jobDetails, setJobDetails] = useState(initState);
    const handleChange = (e) => {
        e.persist();
        setJobDetails((oldState) => ({
            ...oldState,
            [e.target.name]: e.target.value,
        }));
    };


    const addRemoveSkill = (skills) =>
        jobDetails.skills.includes(skills)
            ? setJobDetails((oldState) => ({
                ...oldState,
                skills: oldState.skills.filter((s) => s !== skills),
            }))
            : setJobDetails((oldState) => ({
                ...oldState,
                skills: oldState.skills.concat(skills),
            }));

    const handleSubmit = async () => {
        for(const field in jobDetails){
            if(typeof jobDetails[field]==="string"&&!jobDetails[field]) return;
        }
        if(!jobDetails.skills.length) return;
        setLoading(true);
        await props.postJob(jobDetails);
        closeModal();
    }
    const closeModal=()=>{
          
        setJobDetails(initState)
        setLoading(false);
        props.closeModal();
    };

    const classes = useStyles();
    const skills = [
        "Javascript",
        "React",
        "Node",
        "Spring boot",
        "MongoDB",
        "SQL",
        "Java",
        "C++",

    ];
    console.log(jobDetails);
    return (
        <Dialog open={props.newJobModal} fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center" >
                    Post Job
                    <IconButton onClick={closeModal}>
                        <CloseIcon />
                    </IconButton>

                </Box>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <FilledInput autoComplete="off" name="title" value={jobDetails.title} onChange={handleChange} placeholder="Job title *" disableUnderline fullWidth />
                    </Grid>


                    <Grid item xs={6}>
                        <Select name="type" value={jobDetails.type} onChange={handleChange} fullWidth disableUnderline variant="filled" >
                            <MenuItem value="Full time">Full time</MenuItem>
                            <MenuItem value="Part time">Part time</MenuItem>
                            <MenuItem value="Contract">Contract</MenuItem>
                        </Select>
                    </Grid>

                    <Grid item xs={6}>
                        <FilledInput autoComplete="off" name="companyName" value={jobDetails.companyName} onChange={handleChange} placeholder="Company name *" disableUnderline fullWidth />
                    </Grid>

                    <Grid item xs={6}>
                        <FilledInput autoComplete="off" name="companyUrl" value={jobDetails.companyUrl} onChange={handleChange} placeholder="Company URL *" disableUnderline fullWidth />
                    </Grid>

                    <Grid item xs={6}>
                        <Select name="location" value={jobDetails.location} onChange={handleChange} disableUnderline fullWidth variant="filled">
                            <MenuItem value="Remote">Remote</MenuItem>
                            <MenuItem value="In-office">In-office</MenuItem>
                        </Select>
                    </Grid>


                    <Grid item xs={6}>
                        <FilledInput autoComplete="off" name="link" value={jobDetails.link} onChange={handleChange} placeholder="Job link *" disableUnderline fullWidth />
                    </Grid>

                    <Grid item xs={12}>
                        <FilledInput autoComplete="off" name="description" value={jobDetails.description} onChange={handleChange} placeholder="Job Description *" disableUnderline fullWidth multiline rows={4} />
                    </Grid>
                </Grid>
                <Box mt={2}>
                    <Typography>Skills* </Typography>
                    <Box display="flex">
                        {skills.map((skills) => (
                            <Box onClick={() => addRemoveSkill(skills)} className={`${classes.skillChip} ${jobDetails.skills.includes(skills) && classes.included
                                }`}
                                key={skills}


                            >
                                {skills}
                            </Box>
                        ))}
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Box
                    color="red"
                    width="100%"
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center">

                    <Typography variant="caption">* Required field</Typography>

                    <Button onClick={handleSubmit} variant="contained" disableElevation color="primary" disabled={loading}
                    >
                        {loading ? (
                            <CircularProgress color="secondary" size={22} />
                        ) : (
                            "Post job"
                        )
                        }
                    </Button>
                </Box>
            </DialogActions>
        </Dialog >
    );
};