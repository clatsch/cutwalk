module.exports = {
    testEnvironment: "node",
    moduleNameMapper: {
        "^@controllers/(.*)$": "<rootDir>/controllers/$1",
        "^@models/(.*)$": "<rootDir>/models/$1"
    }
};
