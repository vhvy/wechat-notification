const path = require("path");

const getPath = _ => path.resolve("./", _);

module.exports = {
    target: "webworker",
    entry: getPath("src/index.ts"),
    output: {
        filename: "worker.js",
        path: getPath("dist"),
    },
    resolve: {
        extensions: [".ts", ".js"],
        alias: {
            '@': getPath("src/")
        }
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader"
            }
        ]
    }
}