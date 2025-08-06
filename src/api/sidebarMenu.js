import axios from './axios'

const resource = '/SidebarMenu'

export default {
    getAll() {
        return axios.get(`${resource}/GetAllSidebar`)
    },
    getByHeaderId(headerId) {
        return axios.get(`${resource}/GetSidebarByHeaderId/${headerId}`)
    }
}