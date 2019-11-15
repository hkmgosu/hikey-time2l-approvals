const bucket = () => `time2l-lambda-approvals-${process.env.NODE_ENV === 'dev' ? 'development' : process.env.NODE_ENV}`;

module.exports = {
    assetPrefix: `https://s3.eu-central-1.amazonaws.com/${bucket()}`,
    target: 'serverless'
};
