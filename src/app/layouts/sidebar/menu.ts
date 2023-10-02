import { MenuItem } from './menu.model';

let aMenu: MenuItem[] = [
    {
        id: 1,
        label: 'MENUITEMS.MENU.TEXT',
        isTitle: true,
        roles: ['ADMINISTRADOR', 'VENDEDOR', 'COORDINADOR', 'BACKOFFICE']
    },
    {
        id: 2,
        label: 'MENUITEMS.MAIN.TEXT',
        icon: 'bx-home-circle',
        link: '/main',
        roles: ['ADMINISTRADOR', 'VENDEDOR', 'COORDINADOR', 'BACKOFFICE']

    },

    {
        id: 3,
        label: 'MENUITEMS.SALE.TEXT',
        icon: 'bx bx-cart-alt ',
        link: '/sale',
        roles: ['ADMINISTRADOR', 'VENDEDOR', 'COORDINADOR', 'BACKOFFICE']

    },
    {
        id: 4,
        label: 'MENUITEMS.CALL.TEXT',
        icon: 'bx bxs-phone-call ',
        link: '/call',
        roles: ['ADMINISTRADOR', 'VENDEDOR', 'COORDINADOR', 'BACKOFFICE']

    },
    {
        id: 5,
        label: 'MENUITEMS.APPS.TEXT',
        isTitle: true,
        roles: ['ADMINISTRADOR', 'VENDEDOR', 'COORDINADOR', 'BACKOFFICE']

    },
    {
        id: 6,
        label: 'MENUITEMS.CALENDAR.TEXT',
        icon: 'bx bx-calendar ',
        badge: {
            variant: 'success',
            text: 'MENUITEMS.CALENDAR.BADGE',
        },
        link: '/calendar',
        roles: ['ADMINISTRADOR', 'VENDEDOR', 'COORDINADOR', 'BACKOFFICE']

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
        isTitle: true,
        roles: ['ADMINISTRADOR', 'COORDINADOR', 'BACKOFFICE']

    },
    {
        id: 8,
        label: 'MENUITEMS.MAINTENANCE.LIST.COUNTRY',
        icon: 'bx bxs-flag',
        link: '/maintenances/country',
        roles: ['ADMINISTRADOR']

    },
    {
        id: 9,
        label: 'MENUITEMS.MAINTENANCE.LIST.TYPE_CURRENCY',
        icon: 'mdi mdi-currency-btc',
        link: '/maintenances/currency',
        roles: ['ADMINISTRADOR']

    },
    {
        id: 9,
        label: 'MENUITEMS.MAINTENANCE.LIST.CAMPUS',
        icon: 'bx bx-buildings',
        link: '/maintenances/campus',
        roles: ['ADMINISTRADOR']

    },
    {
        id: 10,
        label: 'MENUITEMS.MAINTENANCE.LIST.USER',
        icon: 'bx bx-user',
        link: '/maintenances/user',
        roles: ['ADMINISTRADOR']

    },
    {
        id: 11,
        label: 'MENUITEMS.MAINTENANCE.LIST.GROUP',
        icon: 'bx bx-group  ',
        link: '/maintenances/group',
        roles: ['ADMINISTRADOR', 'COORDINADOR']

    },
    {
        id: 12,
        label: 'MENUITEMS.MAINTENANCE.LIST.CATEGORY',
        icon: 'mdi mdi-shape ',
        link: '/maintenances/category',
        roles: ['ADMINISTRADOR']

    },
    {
        id: 13,
        label: 'MENUITEMS.MAINTENANCE.LIST.BRAND',
        icon: 'mdi mdi-watermark',
        link: '/maintenances/brand',
        roles: ['ADMINISTRADOR']

    },
    {
        id: 14,
        label: 'MENUITEMS.MAINTENANCE.LIST.PRODUCT',
        icon: 'mdi mdi-shopping',
        link: '/maintenances/product',
        roles: ['ADMINISTRADOR']

    },
    {
        id: 14,
        label: 'MENUITEMS.MAINTENANCE.LIST.SERVICE',
        icon: 'bx bxl-dropbox ',
        link: '/maintenances/service',
        roles: ['ADMINISTRADOR']

    },
    {
        id: 15,
        label: 'MENUITEMS.MAINTENANCE.LIST.PROMOTION',
        icon: 'bx bx-purchase-tag-alt ',
        link: '/maintenances/promotion',
        roles: ['ADMINISTRADOR', 'COORDINADOR']

    },
    {
        id: 16,
        label: 'MENUITEMS.MAINTENANCE.LIST.ADVERTISEMENT',
        icon: 'bx bxs-megaphone ',
        link: '/maintenances/advertisement',
        roles: ['ADMINISTRADOR', 'COORDINADOR']


    },
    {
        id: 17,
        label: 'MENUITEMS.MAINTENANCE.LIST.MANUAL',
        icon: 'bx bxs-book ',
        link: '/maintenances/manual',
        roles: ['ADMINISTRADOR', 'COORDINADOR', 'BACKOFFICE']


    },
    {
        id: 18,
        label: 'MENUITEMS.MAINTENANCE.LIST.TYPES.LABEL',
        icon: 'bx bxs-cog ',
        link: '/',
        roles: ['ADMINISTRADOR'],
        subItems: [
            {
                id: 17,
                parentId: 16,
                label: 'MENUITEMS.MAINTENANCE.LIST.TYPES.LIST.TYPE_BANK_ACCOUNT',
                link: '/maintenances/types/typeBankAccount',
                roles: ['ADMINISTRADOR']

            },
            {
                id: 18,
                parentId: 16,
                label: 'MENUITEMS.MAINTENANCE.LIST.TYPES.LIST.TYPE_DOCUMENT',
                link: '/maintenances/types/typeDocument',
                roles: ['ADMINISTRADOR']
            },
            {
                id: 19,
                parentId: 16,
                label: 'MENUITEMS.MAINTENANCE.LIST.TYPES.LIST.TYPE_USER',
                link: '/maintenances/types/typeUser',
                roles: ['ADMINISTRADOR']
            },
            {
                id: 20,
                parentId: 16,
                label: 'MENUITEMS.MAINTENANCE.LIST.TYPES.LIST.TYPE_STATUS',
                link: '/maintenances/types/typeStatus',
                roles: ['ADMINISTRADOR']
            },
            {
                id: 21,
                parentId: 16,
                label: 'MENUITEMS.MAINTENANCE.LIST.TYPES.LIST.TYPE_SERVICE',
                link: '/maintenances/types/typeService',
                roles: ['ADMINISTRADOR']
            },

        ]
    },
    {
        id: 22,
        label: 'MENUITEMS.MAINTENANCE.LIST.CALL.LABEL',
        icon: 'mdi mdi-cellphone-cog',
        link: '/',
        roles: ['ADMINISTRADOR'],
        subItems: [
            {
                id: 23,
                parentId: 22,
                label: 'MENUITEMS.MAINTENANCE.LIST.CALL.LIST.OPERATOR',
                link: '/call-settings/operator',
                roles: ['ADMINISTRADOR']
            },
            {
                id: 24,
                parentId: 22,
                label: 'MENUITEMS.MAINTENANCE.LIST.CALL.LIST.TYPIFICATION',
                link: '/call-settings/typification',
                roles: ['ADMINISTRADOR']
            }
        ]
    },

    {
        id: 22,
        label: 'MENUITEMS.SETTINGS.TEXT',
        isTitle: true,
        roles: ['ADMINISTRADOR']
    },
    {
        id: 23,
        label: 'MENUITEMS.SETTINGS.LIST.ALLOWED_IPS',
        icon: 'bx bx-link-external  ',
        link: '/allowed-ip',
        roles: ['ADMINISTRADOR']
    },
    {
        id: 24,
        label: 'MENUITEMS.SETTINGS.LIST.PERMISSION',
        icon: 'bx bx-shield-quarter',
        link: '/settings/permission',
        roles: ['ADMINISTRADOR']
    },
    {
        id: 25,
        label: 'MENUITEMS.SETTINGS.LIST.PERMISSION_ACCOUNT',
        icon: 'bx bx-shield-quarter',
        link: '/settings/type_user_permission',
        roles: ['ADMINISTRADOR']
    },

    {
        id: 26,
        label: 'MENUITEMS.CHARTS.TEXT',
        isTitle: true,
        roles: ['ADMINISTRADOR']
    },
    {
        id: 27,
        icon: 'bxs-bar-chart-alt-2',
        label: 'MENUITEMS.CHARTS.TEXT',
        roles: ['ADMINISTRADOR'],
        subItems: [
            {
                id: 28,
                label: 'MENUITEMS.CHARTS.LIST.ALL',
                link: '/',
                parentId: 27,
                roles: ['ADMINISTRADOR']
            },
            {
                id: 29,
                label: 'MENUITEMS.CHARTS.LIST.COMERCIAL',
                link: '/',
                parentId: 27,
                roles: ['ADMINISTRADOR']
            },
            {
                id: 30,
                label: 'MENUITEMS.CHARTS.LIST.COORDINATION',
                link: '/',
                parentId: 27,
                roles: ['ADMINISTRADOR']
            }
        ]
    }
]


export const MENU: MenuItem[] = aMenu;

// if (data) {

//     if (data.user.tipo_usuario === 'VENDEDOR') {
//         aMenu = [...aMenu, ...[
//             {
//                 id: 3,
//                 label: 'MENUITEMS.SALE.TEXT',
//                 icon: 'bx bx-cart-alt ',
//                 link: '/sale'
//             },
//             {
//                 id: 4,
//                 label: 'MENUITEMS.CALL.TEXT',
//                 icon: 'bx bxs-phone-call ',
//                 link: '/call'
//             },
//             {
//                 id: 5,
//                 label: 'MENUITEMS.APPS.TEXT',
//                 isTitle: true
//             },
//             {
//                 id: 6,
//                 label: 'MENUITEMS.CALENDAR.TEXT',
//                 icon: 'bx bx-calendar ',
//                 badge: {
//                     variant: 'success',
//                     text: 'MENUITEMS.CALENDAR.BADGE',
//                 },
//                 link: '/calendar'
//             }
//         ]]
//     }

//     if (data.user.tipo_usuario === 'BACKOFFICE') {
//         aMenu = [...aMenu, ...[
//             {
//                 id: 3,
//                 label: 'MENUITEMS.SALE.TEXT',
//                 icon: 'bx bx-cart-alt ',
//                 link: '/sale'
//             },
//             {
//                 id: 4,
//                 label: 'MENUITEMS.CALL.TEXT',
//                 icon: 'bx bxs-phone-call ',
//                 link: '/call'
//             },
//             {
//                 id: 5,
//                 label: 'MENUITEMS.APPS.TEXT',
//                 isTitle: true
//             },
//             {
//                 id: 6,
//                 label: 'MENUITEMS.CALENDAR.TEXT',
//                 icon: 'bx bx-calendar ',
//                 badge: {
//                     variant: 'success',
//                     text: 'MENUITEMS.CALENDAR.BADGE',
//                 },
//                 link: '/calendar'
//             },
//             {
//                 id: 7,
//                 label: 'MENUITEMS.MAINTENANCE.TEXT',
//                 isTitle: true
//             },

//             {
//                 id: 17,
//                 label: 'MENUITEMS.MAINTENANCE.LIST.MANUAL',
//                 icon: 'bx bxs-book ',
//                 link: '/maintenances/manual'
//             },

//         ]]
//     }

//     if (data.user.tipo_usuario === 'COORDINADOR') {
//         aMenu = [...aMenu, ...[
//             {
//                 id: 3,
//                 label: 'MENUITEMS.SALE.TEXT',
//                 icon: 'bx bx-cart-alt ',
//                 link: '/sale'
//             },
//             {
//                 id: 4,
//                 label: 'MENUITEMS.CALL.TEXT',
//                 icon: 'bx bxs-phone-call ',
//                 link: '/call'
//             },
//             {
//                 id: 5,
//                 label: 'MENUITEMS.APPS.TEXT',
//                 isTitle: true
//             },
//             {
//                 id: 6,
//                 label: 'MENUITEMS.CALENDAR.TEXT',
//                 icon: 'bx bx-calendar ',
//                 badge: {
//                     variant: 'success',
//                     text: 'MENUITEMS.CALENDAR.BADGE',
//                 },
//                 link: '/calendar'
//             },
//             {
//                 id: 7,
//                 label: 'MENUITEMS.MAINTENANCE.TEXT',
//                 isTitle: true
//             },
//             {
//                 id: 11,
//                 label: 'MENUITEMS.MAINTENANCE.LIST.GROUP',
//                 icon: 'bx bx-group  ',
//                 link: '/maintenances/group'
//             },
//             {
//                 id: 15,
//                 label: 'MENUITEMS.MAINTENANCE.LIST.PROMOTION',
//                 icon: 'bx bx-purchase-tag-alt ',
//                 link: '/maintenances/promotion'
//             },
//             {
//                 id: 16,
//                 label: 'MENUITEMS.MAINTENANCE.LIST.ADVERTISEMENT',
//                 icon: 'bx bxs-megaphone ',
//                 link: '/maintenances/advertisement'
//             },
//             {
//                 id: 17,
//                 label: 'MENUITEMS.MAINTENANCE.LIST.MANUAL',
//                 icon: 'bx bxs-book ',
//                 link: '/maintenances/manual'
//             },

//         ]]
//     }

//     if (data.user.tipo_usuario === 'ADMINISTRADOR') {
//         aMenu = [
//             {
//                 id: 1,
//                 label: 'MENUITEMS.MENU.TEXT',
//                 isTitle: true
//             },
//             {
//                 id: 2,
//                 label: 'MENUITEMS.MAIN.TEXT',
//                 icon: 'bx-home-circle',
//                 link: '/main'
//             },
//             {
//                 id: 3,
//                 label: 'MENUITEMS.SALE.TEXT',
//                 icon: 'bx bx-cart-alt ',
//                 link: '/sale'
//             },
//             {
//                 id: 4,
//                 label: 'MENUITEMS.CALL.TEXT',
//                 icon: 'bx bxs-phone-call ',
//                 link: '/call'
//             },
//             {
//                 id: 5,
//                 label: 'MENUITEMS.APPS.TEXT',
//                 isTitle: true
//             },
//             {
//                 id: 6,
//                 label: 'MENUITEMS.CALENDAR.TEXT',
//                 icon: 'bx bx-calendar ',
//                 badge: {
//                     variant: 'success',
//                     text: 'MENUITEMS.CALENDAR.BADGE',
//                 },
//                 link: '/calendar'
//             },
//             // {
//             //     id: 5,
//             //     label: 'MENUITEMS.CHAT.TEXT',
//             //     icon: 'bx bx-chat',
//             //     badge: {
//             //         variant: 'primary',
//             //         text: 'MENUITEMS.CHAT.BADGE',
//             //     },
//             //     link: '/',
//             // },
//             {
//                 id: 7,
//                 label: 'MENUITEMS.MAINTENANCE.TEXT',
//                 isTitle: true
//             },
//             {
//                 id: 8,
//                 label: 'MENUITEMS.MAINTENANCE.LIST.COUNTRY',
//                 icon: 'bx bxs-flag',
//                 link: '/maintenances/country'
//             },
//             {
//                 id: 9,
//                 label: 'MENUITEMS.MAINTENANCE.LIST.CURRENCY',
//                 icon: 'mdi mdi-currency-btc',
//                 link: '/maintenances/currency'
//             },
//             {
//                 id: 9,
//                 label: 'MENUITEMS.MAINTENANCE.LIST.CAMPUS',
//                 icon: 'bx bx-buildings',
//                 link: '/maintenances/campus'
//             },
//             {
//                 id: 10,
//                 label: 'MENUITEMS.MAINTENANCE.LIST.USER',
//                 icon: 'bx bx-user',
//                 link: '/maintenances/user'
//             },
//             {
//                 id: 11,
//                 label: 'MENUITEMS.MAINTENANCE.LIST.GROUP',
//                 icon: 'bx bx-group  ',
//                 link: '/maintenances/group'
//             },
//             {
//                 id: 12,
//                 label: 'MENUITEMS.MAINTENANCE.LIST.CATEGORY',
//                 icon: 'mdi mdi-shape ',
//                 link: '/maintenances/category'
//             },
//             {
//                 id: 13,
//                 label: 'MENUITEMS.MAINTENANCE.LIST.BRAND',
//                 icon: 'mdi mdi-watermark',
//                 link: '/maintenances/brand'
//             },
//             {
//                 id: 14,
//                 label: 'MENUITEMS.MAINTENANCE.LIST.PRODUCT',
//                 icon: 'mdi mdi-shopping',
//                 link: '/maintenances/product'
//             },
//             {
//                 id: 14,
//                 label: 'MENUITEMS.MAINTENANCE.LIST.SERVICE',
//                 icon: 'bx bxl-dropbox ',
//                 link: '/maintenances/service'
//             },
//             {
//                 id: 15,
//                 label: 'MENUITEMS.MAINTENANCE.LIST.PROMOTION',
//                 icon: 'bx bx-purchase-tag-alt ',
//                 link: '/maintenances/promotion'
//             },
//             {
//                 id: 16,
//                 label: 'MENUITEMS.MAINTENANCE.LIST.ADVERTISEMENT',
//                 icon: 'bx bxs-megaphone ',
//                 link: '/maintenances/advertisement'
//             },
//             {
//                 id: 17,
//                 label: 'MENUITEMS.MAINTENANCE.LIST.MANUAL',
//                 icon: 'bx bxs-book ',
//                 link: '/maintenances/manual'
//             },
//             {
//                 id: 18,
//                 label: 'MENUITEMS.MAINTENANCE.LIST.TYPES.LABEL',
//                 icon: 'bx bxs-cog ',
//                 link: '/',
//                 subItems: [
//                     {
//                         id: 17,
//                         parentId: 16,
//                         label: 'MENUITEMS.MAINTENANCE.LIST.TYPES.LIST.TYPE_BANK_ACCOUNT',
//                         link: '/maintenances/types/typeBankAccount'
//                     },
//                     {
//                         id: 18,
//                         parentId: 16,
//                         label: 'MENUITEMS.MAINTENANCE.LIST.TYPES.LIST.TYPE_DOCUMENT',
//                         link: '/maintenances/types/typeDocument'
//                     },
//                     {
//                         id: 19,
//                         parentId: 16,
//                         label: 'MENUITEMS.MAINTENANCE.LIST.TYPES.LIST.TYPE_USER',
//                         link: '/maintenances/types/typeUser'
//                     },
//                     {
//                         id: 20,
//                         parentId: 16,
//                         label: 'MENUITEMS.MAINTENANCE.LIST.TYPES.LIST.TYPE_STATUS',
//                         link: '/maintenances/types/typeStatus'
//                     },
//                     {
//                         id: 21,
//                         parentId: 16,
//                         label: 'MENUITEMS.MAINTENANCE.LIST.TYPES.LIST.TYPE_SERVICE',
//                         link: '/maintenances/types/typeService'
//                     },

//                 ]
//             },
//             {
//                 id: 22,
//                 label: 'MENUITEMS.MAINTENANCE.LIST.CALL.LABEL',
//                 icon: 'mdi mdi-cellphone-cog',
//                 link: '/',
//                 subItems: [
//                     {
//                         id: 23,
//                         parentId: 22,
//                         label: 'MENUITEMS.MAINTENANCE.LIST.CALL.LIST.OPERATOR',
//                         link: '/call-settings/operator'
//                     },
//                     {
//                         id: 24,
//                         parentId: 22,
//                         label: 'MENUITEMS.MAINTENANCE.LIST.CALL.LIST.TYPIFICATION',
//                         link: '/call-settings/typification'
//                     }
//                 ]
//             },

//             {
//                 id: 22,
//                 label: 'MENUITEMS.SETTINGS.TEXT',
//                 isTitle: true
//             },
//             {
//                 id: 23,
//                 label: 'MENUITEMS.SETTINGS.LIST.ALLOWED_IPS',
//                 icon: 'bx bx-link-external  ',
//                 link: '/allowed-ip'
//             },
//             {
//                 id: 24,
//                 label: 'MENUITEMS.SETTINGS.LIST.PERMISSION_ACCOUNT',
//                 icon: 'bx bx-shield-quarter',
//                 link: '/'
//             },

//             {
//                 id: 25,
//                 label: 'MENUITEMS.CHARTS.TEXT',
//                 isTitle: true
//             },
//             {
//                 id: 26,
//                 icon: 'bxs-bar-chart-alt-2',
//                 label: 'MENUITEMS.CHARTS.TEXT',
//                 subItems: [
//                     {
//                         id: 27,
//                         label: 'MENUITEMS.CHARTS.LIST.ALL',
//                         link: '/',
//                         parentId: 26
//                     },
//                     {
//                         id: 28,
//                         label: 'MENUITEMS.CHARTS.LIST.COMERCIAL',
//                         link: '/',
//                         parentId: 26
//                     },
//                     {
//                         id: 29,
//                         label: 'MENUITEMS.CHARTS.LIST.COORDINATION',
//                         link: '/',
//                         parentId: 26
//                     }
//                 ]
//             },

//         ]
//     }

//     aMenu.sort((a, b) => a.id - b.id);
// }
