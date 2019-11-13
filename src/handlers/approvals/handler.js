const compat = require('next-aws-lambda');

module.exports = page => {
    return (event, context) => {
        // do any stuff you like
        console.log({ event });
        console.log({ context });
        // this makes sure the next page renders
        // const responsePromise = compat(page)(event, context);
        return compat(page)(event, context);

        // do any other stuff you like

        // return responsePromise;
    };
};
