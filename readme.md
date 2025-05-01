FHSU Spring 2025 INF653 Final Project
-------------------------------------
REST API for 50 States
_____________________________________

Brief Summary:
# Provides information about U.S. states (population, admission date, and "fun facts").
# This API supports filtering and CRUD commands for fun facts.

Available at: [Glitch](https://thrilling-ivory-asiago.glitch.me)
-------------------------------------

<pre>
GET Requests                Response
------------------------------------
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
------------------------------------
/states/:state/funfact      The result received from MongoDB



PATCH Requests              Response
------------------------------------
/states/:state/funfact      The result received from MongoDB


DELETE Requests             Response
------------------------------------
/states/:state/funfact      The result received from MongoDB</pre>