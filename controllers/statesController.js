const State = require("../model/States");
const statesData = require("../model/StatesData.json");
const { logEvents } = require("../middleware/logEvents");


const getAllStates = async (req, res) => {
    try {
        const funFactsMap = await buildFunFactsMap();

        const statesWithFunFacts = statesData.map((state) => {
            return funFactsMap.has(state.code)
                ? { ...state, funfacts: funFactsMap.get(state.code) }
                : { ...state };
        });

        res.json(statesWithFunFacts);
    } catch (error) {
        handleServerError(req, res, error, "Failed to get all states");
    }
};


const getStateData = async (req, res) => {
    const { stateData } = req;
    try {
        const stateFunFacts = await State.findOne({ stateCode: stateData.code }).exec();
        const response = stateFunFacts
            ? { ...stateData, funfacts: stateFunFacts.funfacts }
            : { ...stateData };

        res.json(response);
    } catch (error) {
        handleServerError(req, res, error, "Error fetching state information");    }
};


const getStatesByContiguity = async (req, res) => {
    const { contig } = req.query;
    const isContiguous = contig === "true";
    const nonContiguous = ["AK", "HI"];

    try {
        // Filter based on contiguity
        const filteredStates = statesData.filter((state) =>
            isContiguous
                ? !nonContiguous.includes(state.code)
                : nonContiguous.includes(state.code)
        );

        const funFactsMap = await buildFunFactsMap();

        // Merge filtered states
        const statesWithFunFacts = filteredStates.map((state) => {
            if (funFactsMap.has(state.code)) {
                return { ...state, funfacts: funFactsMap.get(state.code) };
            }
            return { ...state };
        });

        res.json(statesWithFunFacts);
    } catch (error) {
        handleServerError(req, res, error, "Failed to get contiguous states");    }
};



const getStateCapital = (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    const stateData = statesData.find((state) => state.code === stateCode);

    if (stateData) {
        res.json({ state: stateData.state, capital: stateData.capital_city });
    } else {
        res.status(404).json({ error: "State not found" });
    }
};


const getStateNickname = (req, res) => {
    const { stateData } = req;
    res.json({ state: stateData.state, nickname: stateData.nickname });
};


const getStatePopulation = (req, res) => {
    const { stateData } = req;
    res.json({
        state: stateData.state,
        population: stateData.population.toLocaleString("en-US"),
    });
};


const getStateAdmissionDate = (req, res) => {
    const { stateData } = req;
    res.json({
        state: stateData.state,
        admitted: stateData.admission_date,
    });
};


const getStateFunFacts = async (req, res) => {
    const { stateData } = req;

    try {
        const state = await State.findOne({ stateCode: stateData.code });

        if (!state || !Array.isArray(state.funfacts) || state.funfacts.length === 0) {
            return res.status(404).json({ message: `No Fun Facts found for ${stateData.state}` });
        }

        const randomFact = state.funfacts[Math.floor(Math.random() * state.funfacts.length)];

        res.json({ funfact: randomFact });
    } catch (error) {
        handleServerError(req, res, error, "Error retrieving fun facts");    }
};


const addFunFacts = async (req, res) => {
    const stateCode = req.stateData.code;
    const newFunFacts = req.body?.funfacts;

    if (!newFunFacts) {
        return res.status(400).json({ message: "State fun facts value required" });
    } else if (!Array.isArray(newFunFacts)) {
        return res.status(400).json({ message: "State fun facts value must be an array" });
    }

    try {
        const state = await State.findOne({ stateCode });

        // If the state is found, append the new fun facts
        if (state) {
            // Ensure we append only the new fun facts to the existing ones
            // We can use filter to avoid duplicating fun facts
            newFunFacts.forEach(funFact => {
                if (!state.funfacts.includes(funFact)) {
                    state.funfacts.push(funFact);
                }
            });
        } else {
            // If no existing state, create a new state document
            state = new State({ stateCode, funfacts: newFunFacts });
        }

        await state.save();

        logEvents(`CREATE: Added fun facts to ${stateCode}`, 'funfactLog.txt');
        
        // Fetch full state data and include funfacts
        const fullState = statesData.find(s => s.code === stateCode);
        if (!fullState) {
            return res.status(404).json({ message: "State not found" });
        }

        // Now generate response with full state data
        // Return the updated state with all 4 properties
        res.status(200).json({
            state: fullState.state,
            stateCode: fullState.code,
            capital: fullState.capital_city,
            funfacts: state.funfacts
        });
    } catch (error) {
        handleServerError(req, res, error, "Error adding fun facts");    }
};


const updateFunFact = async (req, res) => {
    const { index, funfact } = req.body;
    const { stateData } = req;

    // Validate index
    if (index === undefined || typeof index !== 'number' || index <= 0) {
        return res.status(400).json({ message: "State fun fact index value required" });
    }

    // Validate funfact
    if (!funfact || typeof funfact !== 'string') {
        return res.status(400).json({ message: "State fun fact value required" });
    }

    try {
        const state = await State.findOne({ stateCode: stateData.code });

        if (!state || !Array.isArray(state.funfacts) || state.funfacts.length === 0) {
            return res.status(400).json({ message: `No Fun Facts found for ${stateData.state}` });
        }

        const arrayIndex = index - 1;

        if (arrayIndex < 0 || arrayIndex >= state.funfacts.length) {
            return res.status(400).json({ message: `No Fun Fact found at that index for ${stateData.state}` });
        }

        state.funfacts[arrayIndex] = funfact;

        await state.save();

        logEvents(`UPDATE: Fun fact #${index} updated for ${stateData.state}`, 'funfactLog.txt');
        // Fetch full state data
        const fullState = statesData.find(s => s.code === stateData.code);
        if (!fullState) {
            return res.status(404).json({ message: "State not found" });
        }

        // Return the updated state with all 4 properties
        res.status(200).json({
            state: fullState.state,
            stateCode: fullState.code,
            capital: fullState.capital_city,
            funfacts: state.funfacts
        });
    } catch (error) {
        handleServerError(req, res, error, "Error updating fun fact");    }
};



const deleteFunFact = async (req, res) => {
    const { index } = req.body;
    const { stateData } = req;

    // Validate index
    if (index === undefined || index <= 0) {
        return res.status(400).json({ message: "State fun fact index value required" });
    }

    const arrayIndex = index - 1;

    try {
        const state = await State.findOne({ stateCode: stateData.code });

        if (!state || !Array.isArray(state.funfacts) || state.funfacts.length === 0) {
            return res.status(400).json({ message: `No Fun Facts found for ${stateData.state}` });
        }

        if (arrayIndex < 0 || arrayIndex >= state.funfacts.length) {
            return res.status(400).json({ message: `No Fun Fact found at that index for ${stateData.state}` });
        }

        // Remove the fun fact at the provided index
        state.funfacts.splice(arrayIndex, 1);

        // Save the updated state
        await state.save();

        logEvents(`DELETE: Fun fact #${index} deleted for ${stateData.state}`, 'funfactLog.txt');
        res.status(200).json(generateFunFactsResponse(stateData.code, state.funfacts));
    } catch (error) {
        handleServerError(req, res, error, "Error deleting fun fact");    }
};


module.exports = {
    getAllStates,
    getStateData,
    getStatesByContiguity,
    getStateCapital,
    getStateNickname,
    getStatePopulation,
    getStateAdmissionDate,
    getStateFunFacts,
    addFunFacts,
    updateFunFact,
    deleteFunFact,
};