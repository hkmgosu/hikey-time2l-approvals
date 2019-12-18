import axios from 'axios';
import baseApiPathV1 from '../helpers/baseApiPathV1';
import baseClientApiPathV1 from '../helpers/baseClientApiPathV1';

export const listEntriesForPreApproval = async (userId, referenceId) => {
    const url = `${baseApiPathV1()}pre-approvals/${userId}/${referenceId}`;

    return axios
        .get(url)
        .then(response => response.data)
        .catch(error => {
            throw error;
        })
        .finally(() => {});
};

export const listEntriesForAuthorization = async (userId, referenceId) => {
    const url = `${baseApiPathV1()}authorizations/${userId}/${referenceId}`;

    return axios
        .get(url)
        .then(response => response.data)
        .catch(error => {
            throw error;
        })
        .finally(() => {});
};

export const listEntriesForApproval = async (userId, referenceId) => {
    const url = `${baseApiPathV1()}approvals/${userId}/${referenceId}`;

    return axios
        .get(url)
        .then(response => response.data)
        .catch(error => {
            throw error;
        })
        .finally(() => {});
};

export const updateAssetEntry = async (
    userId,
    referenceId,
    assetTimeEntryId,
    data
) => {
    const url = `${baseClientApiPathV1()}approvals/${userId}/${referenceId}/${assetTimeEntryId}`;

    return axios
        .put(url, data, {
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(response => response.data)
        .catch(error => {
            throw error;
        })
        .finally(() => {});
};

export const preApproveAssetEntries = async (userId, referenceId, data) => {
    const url = `${baseClientApiPathV1()}approvals/${userId}/${referenceId}/preapprove`;

    return axios
        .post(url, data, {
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(response => response.data)
        .catch(error => {
            throw error;
        })
        .finally(() => {});
};

export const approveAssetEntries = async (userId, referenceId, data) => {
    const url = `${baseClientApiPathV1()}approvals/${userId}/${referenceId}/approve`;

    return axios
        .post(url, data, {
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(response => response.data)
        .catch(error => {
            throw error;
        })
        .finally(() => {});
};

export const authorizeAssetEntries = async (userId, referenceId, data) => {
    const url = `${baseClientApiPathV1()}approvals/${userId}/${referenceId}/authorize`;

    return axios
        .post(url, data, {
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(response => response.data)
        .catch(error => {
            throw error;
        })
        .finally(() => {});
};

export const rejectAssetEntries = async (
    userId,
    referenceId,
    entryIds,
    reason
) => {
    const url = `${baseClientApiPathV1()}approvals/${userId}/${referenceId}/reject`;

    return axios
        .post(
            url,
            { entryIds, reason },
            {
                headers: {
                    'content-type': 'application/json'
                }
            }
        )
        .then(response => response.data)
        .catch(error => {
            throw error;
        })
        .finally(() => {});
};
