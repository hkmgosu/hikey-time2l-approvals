import axios from 'axios';
import baseApiPathV1 from '../helpers/baseApiPathV1';
import baseClientApiPathV1 from "../helpers/baseClientApiPathV1";

export const listAllAssetEntries = async (userId, referenceId) => {
    const url = `${baseApiPathV1()}approvals/${userId}/${referenceId}`;

    return axios
        .get(url)
        .then(function(response) {
            return response.data;
        })
        .catch(function(error) {
            throw error;
        })
        .finally(function() {});
};

export const updateAssetEntry = async (userId, referenceId, assetTimeEntryId, data) => {
    const url = `${baseClientApiPathV1()}approvals/${userId}/${referenceId}/${assetTimeEntryId}`;

    return axios
        .put(url, data, {
            headers: {
                "content-type": "application/json"
              }
            })
        .then(function(response) {
            return response.data;
        })
        .catch(function(error) {
            throw error;
        })
        .finally(function() {});
};

export const preApproveAssetEntries = async (userId, referenceId, data) => {
    const url = `${baseClientApiPathV1()}approvals/${userId}/${referenceId}/preapprove`;

    return axios
        .post(url, data, {
            headers: {
                "content-type": "application/json"
              }
            })
        .then(function(response) {
            return response.data;
        })
        .catch(function(error) {
            throw error;
        })
        .finally(function() {});
};

export const rejectAssetEntries = async (userId, referenceId, data) => {
    const url = `${baseClientApiPathV1()}approvals/${userId}/${referenceId}/reject`;

    return axios
        .post(url, data, {
            headers: {
                "content-type": "application/json"
              }
            })
        .then(function(response) {
            return response.data;
        })
        .catch(function(error) {
            throw error;
        })
        .finally(function() {});
};