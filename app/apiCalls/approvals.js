import axios from 'axios';
import baseApiPathV1 from '../helpers/baseApiPathV1';

export default async (userId, referenceId) => {
    const url = `${baseApiPathV1()}approvals/${userId}/${referenceId}`;

    return axios
        .get(url)
        .then(function(response) {
            return response.data.assetTimeEntries;
        })
        .catch(function(error) {
            throw error;
        })
        .finally(function() {});
};
