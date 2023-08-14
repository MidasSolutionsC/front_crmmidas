import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENUITEMS.MENU.TEXT',
        isTitle: true
    },
    {
        id: 2,
        label: 'MENUITEMS.DASHBOARDS.TEXT',
        icon: 'bx-home-circle',
        subItems: [
            {
                id: 3,
                label: 'MENUITEMS.DASHBOARDS.LIST.DEFAULT',
                link: '/',
                parentId: 2
            },
            {
                id: 4,
                label: 'MENUITEMS.DASHBOARDS.LIST.SAAS',
                link: '/',
                parentId: 2
            },
            {
                id: 5,
                label: 'MENUITEMS.DASHBOARDS.LIST.CRYPTO',
                link: '/',
                parentId: 2
            },
            {
                id: 6,
                label: 'MENUITEMS.DASHBOARDS.LIST.BLOG',
                link: '/',
                parentId: 2
            },
            {
                id: 7,
                label: 'MENUITEMS.DASHBOARDS.LIST.JOBS',
                link: '/',
                parentId: 2,
            },
        ]
    },
    {
        id: 8,
        label: 'MENUITEMS.APPS.TEXT',
        isTitle: true
    },
    {
        id: 9,
        label: 'MENUITEMS.ECOMMERCE.TEXT',
        icon: 'bx-store',
        subItems: [
            {
                id: 10,
                label: 'MENUITEMS.ECOMMERCE.LIST.PRODUCTS',
                link: '/',
                parentId: 9
            },
            {
                id: 11,
                label: 'MENUITEMS.ECOMMERCE.LIST.PRODUCTDETAIL',
                link: '/',
                parentId: 9
            },
            {
                id: 12,
                label: 'MENUITEMS.ECOMMERCE.LIST.ORDERS',
                link: '/',
                parentId: 9
            },
            {
                id: 13,
                label: 'MENUITEMS.ECOMMERCE.LIST.CUSTOMERS',
                link: '/',
                parentId: 9
            },
            {
                id: 14,
                label: 'MENUITEMS.ECOMMERCE.LIST.CART',
                link: '/',
                parentId: 9
            },
            {
                id: 15,
                label: 'MENUITEMS.ECOMMERCE.LIST.CHECKOUT',
                link: '/',
                parentId: 9
            },
            {
                id: 16,
                label: 'MENUITEMS.ECOMMERCE.LIST.SHOPS',
                link: '/',
                parentId: 9
            },
            {
                id: 17,
                label: 'MENUITEMS.ECOMMERCE.LIST.ADDPRODUCT',
                link: '/',
                parentId: 9
            },
        ]
    },
    {
        id: 18,
        label: 'MENUITEMS.SETTINGS.TEXT',
        isTitle: true
    },
    {
        id: 19,
        label: 'MENUITEMS.SETTINGS.LIST.CAMPUS',
        icon: 'bx bx-buildings',
        link: '/'
    }

];

