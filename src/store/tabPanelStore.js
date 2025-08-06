import { defineStore } from 'pinia'
import { ref } from 'vue';

export const useTabPanelStore = defineStore('tabPanel', () => {
    const tabs = ref([
        {
            title: 'Home',
            route: '/approval/approval-main',
            closable: false // Không cho click vào tab đầu tiên
        }
    ])

    const activeTab = ref('/approval/approval-main')

    const addTab = (tab) => {
        if (!tabs.value.some(t => t.route === tab.route)) {
            tabs.value.push(tab);
        }
        activeTab.value = tab.route;
    }
    const removeTab = (route) => {
        tabs.value = tabs.value.filter(t => t.route !== route);
        if (tabs.value.length === 0) {
            const defaultTab = {
                title: "Home",
                route: "/approval/approval-main"
            }
            tabs.value.push(defaultTab)
            activeTab.value = defaultTab.route
        }
        if (activeTab.value === route) {
            activeTab.value = tabs.value[tabs.value.length - 1]?.route || "/";
        }
    }

    return {
        tabs,
        activeTab,
        addTab,
        removeTab
    }
});
