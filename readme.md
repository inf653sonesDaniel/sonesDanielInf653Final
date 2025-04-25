FHSU Spring 2025 INF653 Final Project
-------------------------------------
REST API for 50 States
_____________________________________

Brief Summary:
# This RESTful API was developed for 
# the final project of the INF653 Back 
# End Web Development course at Fort 
# Hays State #University (FHSU). It 
# provides detailed information about 
# U.S. states, including data like 
# population, admission date, #and fun 
# facts. The API supports various 
# operations, including filtering and 
# CRUD (Create, Read, Update, Delete) 
# functionality for fun facts, while 
# conforming to REST standards with 
# JSON-formatted responses.

Available at:
URL *****************
-------------------------------------

GET Requests
    /states/ - Get all states data
    /states/?contig=true - Get contiguous states data (excludes AK and HI)
    /states/?contig=false - Get non-contiguous states data (AK and HI only)
    /states/:state - Get data for the specified state
    /states/:state/funfact - Get a random fun fact for the specified state
    /states/:state/capital - Get the capital of the specified state
    /states/:state/nickname - Get the nickname of the specified state
    /states/:state/population - Get the population of the specified state
    /states/:state/admission - Get the admission date of the specified state

POST Requests
    /states/:state/funfact - Add fun facts to the specified state

PATCH Requests
    /states/:state/funfact - Update a specific fun fact of the specified state

DELETE Requests
    /states/:state/funfact - Delete a specific fun fact of the specified state