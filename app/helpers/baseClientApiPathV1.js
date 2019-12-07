export default () => {
    const host = window.location.host;

    const apiSuffix =
        host.includes('localhost') ||
        host.includes('dev') ||
        host.includes('feature')
            ? '-dev'
            : host.includes('staging')
            ? `-staging`
            : '';

    return `https://time2l-api${apiSuffix}.hikey.io/v1/`;
};
