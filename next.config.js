const bucket = () =>
    process.env.NODE_ENV !== 'local'
        ? `https://s3.eu-central-1.amazonaws.com/time2l-lambda-approvals-${
              process.env.NODE_ENV === 'dev'
                  ? 'development'
                  : process.env.NODE_ENV
          }`
        : '';

module.exports = {
    assetPrefix: bucket(),
    target: 'serverless'
};
