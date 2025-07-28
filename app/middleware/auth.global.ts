export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser()

  const publicPages = ['/', '/login', '/register', '/forgot-password']

  console.log('MIDDLEWARE => AUTHENTICATOR => ', to.path, publicPages.includes(to.path));

  if (publicPages.includes(to.path)) return;

  //Because SSR is disabled, we need to ensure the user is loaded before proceeding
  if (process.client) {
    const timeout = 3000
    const start = Date.now()

    while (!user.value && Date.now() - start < timeout) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    console.log('MIDDLEWARE => isAuthenticated:', user.value);
    if (!user.value) {
      return navigateTo('/login')
    }
  }
})
