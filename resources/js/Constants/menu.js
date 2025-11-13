import {
    LuActivity,
    LuChevronRight, LuCircle,
    LuDatabase, LuFileInput,
    LuFileText, LuKeyRound,
    LuLayoutDashboard,
    LuSettings, LuTable, LuUserCog,
    LuUsers
} from "react-icons/lu";
import {AiTwotoneDatabase} from "react-icons/ai";

export const menuItems = [
    {
        id: "dashboard",
        label: "Dashboard",
        icon: LuLayoutDashboard,
        level: 1,
        path: "dashboard",
    },
    {
        id: "dataset",
        label: "Dataset Management",
        icon: LuDatabase,
        level: 1,
        expandIcon: LuChevronRight,
        collapseIcon: LuChevronRight,
        children: [
            { id: "dataset-management", label: "Dataset List", icon: AiTwotoneDatabase, level: 2, path: 'dataset-list.index' },
            { id: "dataset-input", label: "Dataset Entry", icon: LuFileInput, level: 2 , path: 'dataset-entry.index' },
        ],
    },
    {
        id: "settings",
        label: "Settings",
        icon: LuSettings,
        level: 1,
        expandIcon: LuChevronRight,
        collapseIcon: LuChevronRight,
        children: [
            {
                id: "settings-master",
                label: "Master Data",
                icon: LuTable,
                level: 2,
                expandIcon: LuChevronRight,
                collapseIcon: LuChevronRight,
                children: [
                    { id: "settings-master-produsen-data", icon: LuCircle, label: "Produsen Data", level: 3, path: 'data-producers.index' },
                ],
            },
            { id: "settings-users", label: "Users", icon: LuUsers, level: 2, path: 'users.index' },
            { id: "settings-roles", label: "Roles", icon: LuKeyRound, level: 2, path: 'roles.index' },
            { id: "settings-permissions", label: "Permissions", icon: LuUserCog, level: 2, path: 'permissions.index' },
        ],
    },
]