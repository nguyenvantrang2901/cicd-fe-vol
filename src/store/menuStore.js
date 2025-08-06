import { defineStore } from "pinia";
import { ref } from "vue";

export const useMenuStore = defineStore('menus', () => {
    const selectedHeaderID = ref(null)
    const setHeaderID = (id) => {
        selectedHeaderID.value = id
    }
    return {
        selectedHeaderID,
        setHeaderID
    }
});
