import React, { useState, useEffect } from "react";
import { Box, Button, CircularProgress, Grid, ThemeProvider } from "@material-ui/core";
import theme from "./theme/theme.js";
import Header from "./components/Header"
import Searchbar from "./components/Searchbar/index.js";
import JobCard from "./components/Job/Jobcard.js";
import NewJob from "./components/Job/NewJob";
import { Close as CloseIcon } from '@material-ui/icons'
import ViewJobModel from "./components/Job/ViewJobModel.js";
export default () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customSearch, setCustomSearch] = useState(false);
  const [newJobModal, setNewJobModal] = useState(false);
  const [viewJob, setViewJob] = useState({});

  const fetchJobs = async () => {
    setCustomSearch(false);
    setLoading(true);

    try {

      const apiUrl = "https://painful-dolls-production.up.railway.app/todo/all";

      // GET request to the Spring Boot API endpoint
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      // Parse the response JSON directly as an array
      const tempJobs = await response.json();

      // Assuming tempJobs is an array, you can map over it
      const formattedJobs = tempJobs.map((job) => ({
        ...job,
        postedOn: new Date(job.postedOn),
      }));

      // Update the state with the fetched data
      setJobs(formattedJobs);
      setLoading(false);

    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error, e.g., show an error message to the user
      setLoading(false);
    }
  };


  const fetchJobsCustom = async (jobSearch) => {
    setLoading(true);
    setCustomSearch(true);

    try {
      const apiUrl = "https://painful-dolls-production.up.railway.app/todo/all";

      // GET request to the Spring Boot API endpoint to fetch all jobs
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch all jobs: ${response.statusText}`);
      }

      // Parse the response JSON
      const allJobs = await response.json();

      // Apply client-side filtering based on location and type
      const filteredJobs = allJobs.filter((job) => {
        return (
          (!jobSearch.location || job.location === jobSearch.location) &&
          (!jobSearch.type || job.type === jobSearch.type)
        );
      });

      // Update the state with the filtered jobs
      setJobs(filteredJobs);
      setLoading(false);

    } catch (error) {
      console.error("Error fetching and filtering jobs:", error);
      // Handle error, e.g., show an error message to the user
      setLoading(false);
    }
  };


  const postJob = async (jobDetails) => {
    try {
      const apiUrl = "https://painful-dolls-production.up.railway.app/todo";

      // POST request to the Spring Boot API endpoint
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...jobDetails,
          postedOn: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to post job: ${response.statusText}`);
      }

      // Fetch jobs after the job has been successfully posted
      fetchJobs();

    } catch (error) {
      console.error("Error posting job:", error);
      // Handle error, e.g., show an error message to the user
    }
  };


  useEffect(() => {
    fetchJobs();
  }, []);


  return (
    <ThemeProvider theme={theme}>
      <Header openNewJobModal={() => setNewJobModal(true)} />
      <NewJob closeModal={() => setNewJobModal(false)} newJobModal={newJobModal} postJob={postJob} />
      <ViewJobModel job={viewJob} closeModal={() => setViewJob({})} />
      <Box mb={3}>
        <Grid container justify="center">

          <Grid item xs={10}>
            <Searchbar fetchJobsCustom={fetchJobsCustom} />
            {loading ? (
              <Box display="flex" justifyContent="center">
                <CircularProgress />
              </Box>
            ) : (
              <>
                {customSearch && (
                  <Box display="flex" justifyContent="flex-end" my={2}>
                    <Button onClick={fetchJobs}>
                      <CloseIcon size={20} />
                      Custom Search
                    </Button>
                  </Box>
                )}
                {jobs.map((job) => (<JobCard open={() => setViewJob(job)} key={job.id} {...job} jobs={jobs} setJobs={setJobs} />

                ))}
              </>
            )}



          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};
