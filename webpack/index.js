const TARGET = process.env.npm_lifecycle_event;

const map = {
    dev: "./webpack.dev",
    build: "./webpack.prod",
};


module.exports = require(map[TARGET]);