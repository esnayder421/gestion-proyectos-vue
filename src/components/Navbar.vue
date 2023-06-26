<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted } from 'vue'
import { Me } from '../services/AuthEndpoints.js'
import router from "@/router";

let profileData = ref({})
const token = $cookies.get('token')
onMounted(async () => {
  const response = await Me(token)

  profileData.value = response
})


const handleLogout = () =>{
  console.log("llego")
  const deleteCookie = $cookies.remove('token')
  router.replace("/");
  toast("Logout Exitoso!","success")
}

const toast = (description,iconM) => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    
    Toast.fire({
      icon: iconM,
      title: description
    })
  }
</script>




<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <img class="" src="/img/logo_largo_blancosinf.png" width="220" />
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav w-100 mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink to="/dashboard/project" class="nav-link active" aria-current="page">Projects</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/dashboard/task" class="nav-link">Tasks</RouterLink>
          </li>
          <li v-if="profileData.id_rol == '1'" class="nav-item">
            <RouterLink to="/dashboard/users" class="nav-link">Users</RouterLink>
          </li>
          <li v-else class="nav-item">
            <a class="nav-link disabled">Users</a>
          </li>
        </ul>
        <i class="bi bi-person-circle"></i>
        <div>
          <li class="navbar-nav dropdown me-3">
            <a class="nav-link dropdown-toggle ps-2" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              {{ profileData.name }}
            </a>
            <ul class="dropdown-menu dropdown-menu-lg-end">
              <li v-if="profileData.id_rol == 1" class="dropdown-item"> rol: Administrador</li>
              <li v-else class="dropdown-item"> rol: Miembro</li>
              <li class="dropdown-item" ><button @click="handleLogout" class="nav-link">logouth</button></li>
            </ul>
          </li>
        </div>
        <!--  <form class="d-flex" role="search">
        <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
        <button class="btn btn-outline-success" type="submit">Search</button>
      </form> -->
      </div>
    </div>
  </nav>
</template>