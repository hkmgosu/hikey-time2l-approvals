export default () => {
    const stage = process.env.AWS_LAMBDA_STAGE;

    const apiSuffix = ['development', 'dev', 'local', 'feature'].includes(stage)
        ? `-dev`
        : stage === 'staging'
        ? `-${stage}`
        : '';

    return `https://time2l-api${apiSuffix}.hikey.io/v1/`;
};
