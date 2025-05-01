//controllers/statesController.js 
const State = require("../model/States");
const statesData = require("../model/StatesData.json");
const { logEvents } = require("../middleware/logEvents");


const getAllStates = async (req, res) => {
    try {
        // Grab fun facts from MongoDB
        const funFactsData = await State.find({});

        // Convert to map
        const funFactsMap = new Map(
            funFactsData.map((state) => [state.stateCode, state.funfacts])
        );

        // Add fun facts to States
        const statesWithFunFacts = statesData.map((state) => {
            if (funFactsMap.has(state.code)) {
                return { ...state, funfacts: funFactsMap.get(state.code) };
            }
            return { ...state };
        });

        res.json(statesWithFunFacts);
    } catch (error) {
        logEvents(`ERROR: ${req.method} ${req.originalUrl} - ${error.message}`, 'errorLog.txt');
        res.status(500).json({ error: error.message });
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
        logEvents(`ERROR: ${req.method} ${req.originalUrl} - ${error.message}`, 'errorLog.txt');
        res.status(500).json({ error: "Error fetching state information" });
    }
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

        // Fetch fun facts from DB
        const funFactsData = await State.find({});
        const funFactsMap = new Map(
            funFactsData.map((state) => [state.stateCode, state.funfacts])
        );

        // Merge filtered states
        const statesWithFunFacts = filteredStates.map((state) => {
            if (funFactsMap.has(state.code)) {
                return { ...state, funfacts: funFactsMap.get(state.code) };
            }
            return { ...state };
        });

        res.json(statesWithFunFacts);
    } catch (error) {
        logEvents(`ERROR: ${req.method} ${req.originalUrl} - ${error.message}`, 'errorLog.txt');
        res.status(500).json({ error: error.message });
    }
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
        logEvents(`ERROR: ${req.method} ${req.originalUrl} - ${error.message}`, 'errorLog.txt');
        res.status(500).json({ error: error.message });
    }
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
        const state = await State.findOneAndUpdate(
            { stateCode },
            { $push: { funfacts: { $each: newFunFacts } } },
            { new: true, upsert: true }
        );

        logEvents(`CREATE: Added fun facts to ${stateCode}`, 'funfactLog.txt');
        res.status(newFunFacts.length === 0 ? 200 : 201).json(state);
    } catch (error) {
        logEvents(`ERROR: ${req.method} ${req.originalUrl} - ${error.message}`, 'errorLog.txt');
        res.status(500).json({ error: error.message });
    }
};


const updateFunFact = async (req, res) => {
    const { index, funfact } = req.body;
    const { stateData } = req;

    // Validate index
    if (index === undefined) {
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
        res.status(200).json(state);
    } catch (error) {
        logEvents(`ERROR: ${req.method} ${req.originalUrl} - ${error.message}`, 'errorLog.txt');
        res.status(500).json({ error: error.message });
    }
};



const deleteFunFact = async (req, res) => {
    const { index } = req.body;
    const { stateData } = req;

    // Validate index
    if (index === undefined) {
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

        state.funfacts.splice(arrayIndex, 1); // Remove the fun fact
        await state.save();

        logEvents(`DELETE: Fun fact #${index} deleted for ${stateData.state}`, 'funfactLog.txt');
        res.status(200).json(state);
    } catch (error) {
        logEvents(`ERROR: ${req.method} ${req.originalUrl} - ${error.message}`, 'errorLog.txt');
        res.status(500).json({ error: error.message });
    }
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