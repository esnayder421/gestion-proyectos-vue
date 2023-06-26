
<script setup>
import {deleteProject} from '../services/ProjectEndpoints.js'
import { RouterLink, RouterView } from 'vue-router'
import router from "@/router";


const props = defineProps({
  project:Object
})
const token = $cookies.get('token')

const handleDelete = async (id) =>{
  const responseDelete = await deleteProject(token, id)
}
const handleUpdate = () => {

}

</script>



<template>
  <div class="card" style="width: 18rem;">
    <div class="card-header">
      <h5 class="card-title">{{ project.projectTitle }}</h5>

    </div>
    <div class="card-body">
      <!-- <h6 class="card-subtitle mb-2 text-body-secondary">Card subtitle</h6> -->
      <p class="card-text">{{ project.projectDesc }}</p>
      <p class="card-text">{{ project.initialDate }}</p>
      <p class="card-text">{{ project.finalDate }}</p>
    </div>

    <div class="card-footer">
      <div class="d-flex gap-5">
        <RouterLink :to="{name:'dashboard_project_id' , params:{id: project.id}}" class="btn btn-outline-warning "> Actualizar</RouterLink>
      <button @click="handleDelete(project.id)" class="btn btn-outline-danger"> Eliminar</button>
      </div>
    </div>

    <!-- <h2>{{ project.id }}</h2> -->

  </div>
</template>