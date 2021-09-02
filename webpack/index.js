const TARGET = process.env.npm_lifecycle_event;

const defaultConfig = "./webpack.prod";

const map = {
    dev: "./webpack.dev",
    build: defaultConfig
};

const config = map[TARGET] ?? defaultConfig;

module.exports = require(config);