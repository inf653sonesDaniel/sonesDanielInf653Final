//middleware/funFactsUtils.js
const State = require("../model/States");
const statesData = require("../model/StatesData.json");

// Build a Map of stateCode => funfacts
const buildFunFactsMap = async () => {
    const funFactsData = await State.find({});
    return new Map(funFactsData.map(state => [state.stateCode, state.funfacts]));
};

// Check if state has funfacts in DB
const getValidFunFactState = async (stateCode, stateName, res) => {
    const state = await State.findOne({ stateCode });

    if (!state || !Array.isArray(state.funfacts) || state.funfacts.length === 0) {
        res.status(400).json({ message: `No Fun Facts found for ${stateName}` });
        return null;
    }

    return state;
};

// Utility function to generate the response structure
const generateFunFactsResponse = (stateData, funfacts) => {
    const fullState = statesData.find(s => s.code === stateCode);
    if (!fullState) return { message: "Invalid state code" };

    return {
        ...fullState,
        funfacts
    };
};

module.exports = {
    buildFunFactsMap,
    getValidFunFactState,
    generateFunFactsResponse
};
