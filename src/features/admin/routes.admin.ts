import type { RouteRecordRaw } from 'vue-router'
const ProductAdminForm = () => import('@/features/admin/views/product/ProductAdminForm.vue')
const ProductAdminList = () => import('@/features/admin/views/product/ProductAdminList.vue')
const ContactAdminList = () => import('@/features/admin/views/contact/ContactAdminList.vue')
const CommandAdminList = () => import('@/features/admin/views/command/CommandAdminList.vue')
const ContactDetails = () => import('@/features/admin/views/contact/ContactDetails.vue')

export const ADMIN_ROUTES: RouteRecordRaw[] = [
  {
    path: '',
    redirect: '/admin/product-form',
  },
  {
    path: '/product-form',
    component: ProductAdminForm,
    meta: {
      requiresAdmin: true,
    },
  },
  {
    path: '/product-list',
    component: ProductAdminList,
    meta: {
      requiresAdmin: true,
    },
  },
  {
    path: '/product-edit/:id?',
    name: 'product-edit',
    component: ProductAdminForm,
    meta: {
      requiresAdmin: true,
    },
  },
  {
    path: '/command/list',
    component: CommandAdminList,
    meta: {
      requiresAdmin: true,
    },
  },
  {
    path: '/contacts/list',
    component: ContactAdminList,
    meta: {
      requiresAdmin: true,
    },
  },
  {
    path: '/contact/:id',
    component: ContactDetails,
    name: 'contact-details',
    meta: {
      requiresAdmin: true,
    },
  },
]
