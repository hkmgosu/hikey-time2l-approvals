export default () => {
    // eslint-disable-next-line no-undef
    const { host } = window.location;

    let apiSuffix = '';

    if (
        host.includes('localhost') ||
        host.includes('dev') ||
        host.includes('feature')
    ) {
        apiSuffix = '-dev';
    }

    if (host.includes('staging')) {
        apiSuffix = `-staging`;
    }

    return `https://time2l-api${apiSuffix}.hikey.io/v1/`;
};
