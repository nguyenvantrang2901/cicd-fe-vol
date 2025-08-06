import { ref } from 'vue';

const tabs = ref([
    {
        title: "Home",
        route: "/approval/approval-main",
        closable: false // Home tab is not closable
    }
])

const activeTab = ref("/approval/approval-main");

export const useTabStore = () => {
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
}
