FHSU Spring 2025 INF653 Final Project
-------------------------------------
REST API for 50 States
_____________________________________

Brief Summary:
# This RESTful API was developed for the final project of the INF653 Back End Web Development course at Fort Hays State University (FHSU). It provides detailed information about U.S. states, including data like population, admission date, and fun facts. The API supports various operations, including filtering and CRUD (Create, Read, Update, Delete) functionality for fun facts, while conforming to REST standards with JSON-formatted responses.

Available at: *****************
-------------------------------------

<pre>
GET Requests                Response
/states/                    All state data returned
/states/?contig=true        All state data for contiguous states (Not AK or HI)
/states/?contig=false       All state data for non-contiguous states (AK, HI)
/states/:state              All data for the state URL parameter
/states/:state/funfact      A random fun fact for the state URL parameter
/states/:state/capital      { ‘state’: stateName, ‘capital’: capitalName }
/states/:state/nickname     { ‘state’: stateName, ‘nickname’: nickname }
/states/:state/population   { ‘state’: stateName, ‘population’: population }
/states/:state/admission    { ‘state’: stateName, ‘admitted’: admissionDate }


POST Requests               Response
/states/:state/funfact      The result received from MongoDB



PATCH Requests              Response
/states/:state/funfact      The result received from MongoDB


DELETE Requests             Response
/states/:state/funfact      The result received from MongoDB</pre>