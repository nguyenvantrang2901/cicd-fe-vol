import axios from './axios';

const resource = '/headerItem';

export default {
    getAll() {
        return axios.get(`${resource}/GetAllHeaderItem`);
    }
}