const path = require('path');

module.exports = {
    mode: "production",
    entry: {
        app: "./js/app.js"
    },
    output: {
        filename: "app.bundle.js",
        path: path.resolve(__dirname, "dist")
    }
};