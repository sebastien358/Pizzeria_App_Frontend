import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.ts'
import { ADMIN_ROUTES } from '@/features/admin/routes.admin.ts'

const Admin = () => import('@/features/admin/Admin.vue')
const Login = () =>  import('@/features/pizzeria/components/auth/Login.vue')
const Pizzeria = () =>  import('@/features/pizzeria/Pizzeria.vue')
const Register = () => import('@/features/pizzeria/components/auth/Register.vue')
const RequestPassword = () => import('@/features/pizzeria/components/auth/reset-password/RequestPassword.vue')
const ResetPassword = () => import('@/features/pizzeria/components/auth/reset-password/ResetPassword.vue')
const CommandAddress = () => import('@/features/user/components/command/CommandAddress.vue')
const Payment = () => import('@/features/user/components/command/CommandPayment.vue')
const Finish = () =>  import('@/features/user/components/command/CommandFinish.vue')
const CommandUserList = () =>  import('@/features/user/components/profile/CommandUserList.vue')
const CartProduct = () => import('@/features/pizzeria/components/cart/CartProduct.vue')
const AccountUserEdit = () => import('@/features/user/components/profile/AccountUserEdit.vue')
const PizzaCard = () => import('@/features/pizzeria/components/shop/Pizzas.vue')
const Contact = () => import('@/features/pizzeria/components/contact/Contact.vue')
const Testimonials = () => import('@/features/pizzeria/components/testimonial/Testimonials.vue')

const routes = [
  { path: '/', component: Pizzeria },
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/cart', component: CartProduct },
  { path: '/pizzas', component: PizzaCard },
  { path: '/contact', component: Contact },
  { path: '/testimonials', component: Testimonials },
  { path: '/request-password', component: RequestPassword },
  { path: '/reset-password/:token', component: ResetPassword },
  {
    path: '/command-address',
    component: CommandAddress,
    meta: {
      requiresUser: true,
      hideFooter: true,
    },
  },
  {
    path: '/payment',
    component: Payment,
    meta: {
      requiresUser: true,
      hideFooter: true,
    },
  },
  {
    path: '/payment/:id?',
    name: 'payment-command',
    component: Payment,
    meta: {
      requiresUser: true,
      hideFooter: true,
    },
  },
  {
    path: '/finish',
    component: Finish,
    meta: {
      requiresUser: true,
      hideFooter: true,
    },
  },
  {
    path: '/command/user/list',
    component: CommandUserList,
    meta: {
      requiresUser: true,
      hideFooter: true,
    },
  },
  {
    path: '/account/user/edit/:id',
    name: 'account-user-edit',
    component: AccountUserEdit,
    meta: {
      requiresUser: true,
      hideFooter: true,
    },
  },
  {
    path: '/admin',
    name: 'admin',
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      hideFooter: true,
    },
    component: Admin,
    children: ADMIN_ROUTES,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            el: to.hash,
            behavior: 'smooth',
          })
        }, 100)
      })
    }
    // Cas par défaut — remonte en haut à chaque changement de page
    return { top: 0, behavior: 'smooth' }
  }
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.matched.some(route => route.meta.requiresAuth) && !authStore.isLoggedIn) {
    next({ path: '/login' })
  } else if (to.matched.some((route) => route.meta.requiresAdmin) && !authStore.isAdmin) {
    next({ path: '/' })
  } else if (to.matched.some((route) => route.meta.requiresUser) && !authStore.isUser) {
    next({ path: '/' })
  } else {
    next()
  }
})

export default router
