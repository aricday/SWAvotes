require('dotenv').config();
const swavotes = require("./lib/swavotes");

exports.handler = async (event, context, callback) => {
    const markup = await swavotes.to_html();
    context.succeed(markup);
};
