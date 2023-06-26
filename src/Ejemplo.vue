<script>
import { RouterLink, RouterView } from 'vue-router'
import Tasks from './Tasks.vue'


</script>


<template>
<nav>
    <RouterLink to="/dashboard/task">tasks</RouterLink>
    <RouterView />
</nav>


<h1>ejemplo</h1>
<RouterView />
</template>