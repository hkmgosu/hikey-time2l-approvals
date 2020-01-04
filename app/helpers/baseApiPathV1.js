export default () => {
    const stage = process.env.AWS_LAMBDA_STAGE;

    let apiSuffix = '';

    if (['development', 'dev', 'local', 'feature'].includes(stage)) {
        apiSuffix = '-dev';
    }

    if (stage === 'staging') {
        apiSuffix = '-staging';
    }

    return `https://time2l-api${apiSuffix}.hikey.io/v1/`;
};
