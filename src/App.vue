<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useRouter } from 'vue-router'

const router = useRouter()

const handleLogoClick = () => {
  router.push('/')
}
</script>

<template>
  <header>
    <img
      @click="handleLogoClick"
      alt="Vue logo"
      class="logo"
      src="@/assets/logo-harmony.webp"
      width="224"
      height="51"
    />

    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/checklists">Checklists</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
  background-color: var(--color-primary);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin-bottom: 2rem;
}
.logo {
  cursor: pointer;
}
nav {
  font-size: 1rem;
  text-align: center;
  text-transform: uppercase;
}
nav a {
  display: block;
}
@media (min-width: 1024px) {
  nav a {
    display: inline-block;
    margin-left: 2rem;
  }
}
@media (min-width: 768px) {
  nav a {
    display: inline-block;
    margin-left: 2rem;
  }
}
</style>
