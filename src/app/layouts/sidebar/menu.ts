import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENUITEMS.MENU.TEXT',
        isTitle: true
    },
    {
        id: 2,
        label: 'MENUITEMS.MAIN.TEXT',
        icon: 'bx-home-circle',
        link: '/main'
    },
    {
        id: 3,
        label: 'MENUITEMS.SALE.TEXT',
        icon: 'bx bx-cart-alt ',
        link: '/sale'
    },
    {
        id: 4,
        label: 'MENUITEMS.CALL.TEXT',
        icon: 'bx bxs-phone-call ',
        link: '/call'
    },
    {
        id: 5,
        label: 'MENUITEMS.APPS.TEXT',
        isTitle: true
    },
    {
        id: 6,
        label: 'MENUITEMS.CALENDAR.TEXT',
        icon: 'bx bx-calendar ',
        badge: {
            variant: 'success',
            text: 'MENUITEMS.CALENDAR.BADGE',
        },
        link: '/calendar'
    },
    // {
    //     id: 5,
    //     label: 'MENUITEMS.CHAT.TEXT',
    //     icon: 'bx bx-chat',
    //     badge: {
    //         variant: 'primary',
    //         text: 'MENUITEMS.CHAT.BADGE',
    //     },
    //     link: '/',
    // },
    {
        id: 7,
        label: 'MENUITEMS.MAINTENANCE.TEXT',
        isTitle: true
    },
    {
        id: 8,
        label: 'MENUITEMS.MAINTENANCE.LIST.COUNTRY',
        icon: 'bx bxs-flag',
        link: '/maintenances/country'
    },
    {
        id: 9,
        label: 'MENUITEMS.MAINTENANCE.LIST.TYPE_CURRENCY',
        icon: 'mdi mdi-currency-btc',
        link: '/maintenances/typeCurrency'
    },
    {
        id: 9,
        label: 'MENUITEMS.MAINTENANCE.LIST.CAMPUS',
        icon: 'bx bx-buildings',
        link: '/maintenances/campus'
    },
    {
        id: 10,
        label: 'MENUITEMS.MAINTENANCE.LIST.USER',
        icon: 'bx bx-user',
        link: '/maintenances/user'
    },
    {
        id: 11,
        label: 'MENUITEMS.MAINTENANCE.LIST.GROUP',
        icon: 'bx bx-group  ',
        link: '/maintenances/group'
    },
    {
        id: 12,
        label: 'MENUITEMS.MAINTENANCE.LIST.CATEGORY',
        icon: 'mdi mdi-shape ',
        link: '/maintenances/category'
    },
    {
        id: 13,
        label: 'MENUITEMS.MAINTENANCE.LIST.BRAND',
        icon: 'mdi mdi-watermark',
        link: '/maintenances/brand'
    },
    {
        id: 14,
        label: 'MENUITEMS.MAINTENANCE.LIST.PRODUCT',
        icon: 'mdi mdi-shopping',
        link: '/maintenances/product'
    },
    {
        id: 14,
        label: 'MENUITEMS.MAINTENANCE.LIST.SERVICE',
        icon: 'bx bxl-dropbox ',
        link: '/maintenances/service'
    },
    {
        id: 15,
        label: 'MENUITEMS.MAINTENANCE.LIST.PROMOTION',
        icon: 'bx bx-purchase-tag-alt ',
        link: '/maintenances/promotion'
    },
    {
        id: 16,
        label: 'MENUITEMS.MAINTENANCE.LIST.ADVERTISEMENT',
        icon: 'bx bxs-megaphone ',
        link: '/maintenances/advertisement'
    },
    {
        id: 17,
        label: 'MENUITEMS.MAINTENANCE.LIST.MANUAL',
        icon: 'bx bxs-book ',
        link: '/maintenances/manual'
    },
    {
        id: 18,
        label: 'MENUITEMS.MAINTENANCE.LIST.TYPES.LABEL',
        icon: 'bx bxs-cog ',
        link: '/',
        subItems: [
            {
                id: 17,
                parentId: 16,
                label: 'MENUITEMS.MAINTENANCE.LIST.TYPES.LIST.TYPE_BANK_ACCOUNT',
                link: '/maintenances/types/typeBankAccount'
            },
            {
                id: 18,
                parentId: 16,
                label: 'MENUITEMS.MAINTENANCE.LIST.TYPES.LIST.TYPE_DOCUMENT',
                link: '/maintenances/types/typeDocument'
            },
            {
                id: 19,
                parentId: 16,
                label: 'MENUITEMS.MAINTENANCE.LIST.TYPES.LIST.TYPE_USER',
                link: '/maintenances/types/typeUser'
            },
            {
                id: 20,
                parentId: 16,
                label: 'MENUITEMS.MAINTENANCE.LIST.TYPES.LIST.TYPE_STATUS',
                link: '/maintenances/types/typeStatus'
            },
            {
                id: 21,
                parentId: 16,
                label: 'MENUITEMS.MAINTENANCE.LIST.TYPES.LIST.TYPE_SERVICE',
                link: '/maintenances/types/typeService'
            },

        ]
    },
    {
        id: 22,
        label: 'MENUITEMS.MAINTENANCE.LIST.CALL.LABEL',
        icon: 'mdi mdi-cellphone-cog',
        link: '/',
        subItems: [
            {
                id: 23,
                parentId: 22,
                label: 'MENUITEMS.MAINTENANCE.LIST.CALL.LIST.OPERATOR',
                link: '/call-settings/operator'
            },
            {
                id: 24,
                parentId: 22,
                label: 'MENUITEMS.MAINTENANCE.LIST.CALL.LIST.TYPIFICATION',
                link: '/call-settings/typification'
            }
        ]
    },

    {
        id: 22,
        label: 'MENUITEMS.SETTINGS.TEXT',
        isTitle: true
    },
    {
        id: 23,
        label: 'MENUITEMS.SETTINGS.LIST.ALLOWED_IPS',
        icon: 'bx bx-link-external  ',
        link: '/'
    },
    {
        id: 24,
        label: 'MENUITEMS.SETTINGS.LIST.PERMISSION_ACCOUNT',
        icon: 'bx bx-shield-quarter',
        link: '/'
    },

    {
        id: 25,
        label: 'MENUITEMS.CHARTS.TEXT',
        isTitle: true
    },
    {
        id: 26,
        icon: 'bxs-bar-chart-alt-2',
        label: 'MENUITEMS.CHARTS.TEXT',
        subItems: [
            {
                id: 27,
                label: 'MENUITEMS.CHARTS.LIST.ALL',
                link: '/',
                parentId: 26
            },
            {
                id: 28,
                label: 'MENUITEMS.CHARTS.LIST.COMERCIAL',
                link: '/',
                parentId: 26
            },
            {
                id: 29,
                label: 'MENUITEMS.CHARTS.LIST.COORDINATION',
                link: '/',
                parentId: 26
            }
        ]
    },

];

