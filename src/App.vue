<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateToHome = () => {
  router.push('/')
}
</script>

<template>
  <header>
    <img
      @click="navigateToHome"
      alt="Vue logo"
      class="logo"
      src="@/assets/logo-harmony.webp"
      width="224"
      height="51"
    />

    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/checklists">Checklists</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
  background-color: #184f91;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.logo {
  margin: 2rem;
  margin-left: 1rem;
  cursor: pointer;
}

nav {
  font-size: 14px;
  text-align: center;
  text-transform: uppercase;
  margin: 1rem;
}

nav a.router-link-exact-active {
  color: white;
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 0.5rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

nav a:last-of-type {
  padding-right: 0;
}

@media (min-width: 1024px) {
  .logo {
    margin: 2rem;
  }

  nav {
    font-size: 1.1rem;
    text-transform: uppercase;
    margin: 2rem;
  }

  nav a {
    padding: 0 1rem;
  }
  nav a:last-of-type {
    padding-right: 0;
  }
}
</style>
