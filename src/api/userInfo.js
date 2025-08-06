import axios from "./axios";

const resource = "/userInfo";

export default {
    getAll() {
        return axios.get(`${resource}/GetAllUserInfo`);
    },
    deleteUser(id) {
        return axios.delete(`${resource}/DeleteUser/${id}`);
    },
    updateUser(id, user) {
        return axios.put(`${resource}/UpdateUser/${id}`, user);
    }
}
