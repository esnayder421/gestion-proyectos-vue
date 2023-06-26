<script setup>
import ProgressBar from '../../node_modules/vue-progress-bar-loader/src/components/progress-bar.vue'
import Navbar from '../components/Navbar.vue'
import { ref, onMounted } from 'vue'
import { getTasks, taskRegister, taskGetById, taskUpdate, taskDelete } from '../services/TaskEndpoint.js'
import { GetProjets } from '../services/ProjectEndpoints.js'
import { GetUsers } from '../services/UserEndpoint.js'
import {Me} from '../services/AuthEndpoints'
import router from "@/router";


let data = ref([])
let dataProjects = ref([])
let dataUsers = ref([])
let loader = ref(false)
let profile = ref({})

let title = ref('')
let desc = ref('')
let state = ref('')
let id_project = ref('')
let id_user = ref('')

let titleU = ref('')
let descU = ref('')
let stateU = ref('')
let id_projectU = ref('')
let id_userU = ref('')
let idU = ref('')


const token = $cookies.get('token')
onMounted(async () => {
    try {
        loader.value = true

        const getProfile = await Me(token)
        profile.value = getProfile
        console.log(profile.value)

        const getResponse = await getTasks(token)
        data.value = getResponse

        loader.value = false

        const getProjects = await GetProjets(token)
        dataProjects.value = getProjects


        const getUsers = await GetUsers(token)
        dataUsers.value = getUsers
        
    } catch (error) {
        toast("Ocurrio Un Error vuelve a Iniciar sesion!","error")
        router.replace("/");
    }
})


const handleRegister = async (e) => {
    try {
        e.preventDefault()
        loader.value = true
        const dataRegister = { "title": title.value, "desc": desc.value, "state": state.value, "id_project": id_project.value, "id_user": id_user.value }

        const resposeRegister = await taskRegister(token, dataRegister)

        const getResponse = await getTasks(token)
        data.value = getResponse
        loader.value = false
        toast("Registro Exitoso!","success")
    } catch (error) {
        toast("Ocurrio Un Error vuelve a Intertarlo!","error")
    }
}

const handleGetById = async (id) => {
    const response = await taskGetById(token,id)
    titleU.value = response.title
    descU.value = response.description
    state.value = response.state
    id_projectU.value = response.id_project
    id_userU.value = response.id_user
    idU.value = response.id
}

const handleUpdate = async (e) =>{

    e.preventDefault()
    try {
        loader.value = true
        const dataUpdate = { "title": titleU.value, "desc": descU.value, "state": stateU.value, "id_project": id_projectU.value, "id_user": id_userU.value }

        const responseUpdate = await taskUpdate(token,dataUpdate,idU.value)
        const getResponse = await getTasks(token)
        data.value = getResponse
        loader.value = false
        toast("Actualización Exitosa!","success")
    } catch (error) {
        toast("Ocurrio Un Error vuelve a Intertarlo!","error")
    }
}
const handleDelete = async (id) => {
    try {
        loader.value = true
        const responseDelete = await taskDelete(token, id)
        const getResponse = await getTasks(token)
        data.value = getResponse
        loader.value = false
        toast("Se elimino Correctamente!","success")
    } catch (error) {
        toast("Ocurrio Un Error vuelve a Intertarlo!","error")
    }
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
    <Navbar />

    <div class="container">

        <div class="p-2">
            <h1>Tareas</h1>
        </div>
        <div class="p-2">
            <button v-if="profile.id_rol == '1'" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight2" aria-controls="offcanvasRight2"
                class="btn btn-info">Registrar Nueva Tarea</button>
                <button v-else data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight2" aria-controls="offcanvasRight2"
                class="btn btn-info" disabled>Registrar Nueva Tarea</button>
        </div>
        <div v-if="loader">
            <ProgressBar :duration="7000" :messages="['loading']" :width="30" />
        </div>
        <div v-else class="align-items-center d-flex justify-content-between flex-wrap gap-4">
            <div class="" v-for="task in data">
                <div v-bind:key="task.id">
                    <!-- <CardProject :project="project" /> -->
                    <div class="card" style="width: 18rem;">
                        <div class="card-header">
                            <h5 class="card-title"> Titulo: {{ task.title }}</h5>

                        </div>
                        <div class="card-body">
                            <!-- <h6 class="card-subtitle mb-2 text-body-secondary">Card subtitle</h6> -->
                            <p class="card-text">Descripcion :{{ task.description }}</p>
                            <p v-if="task.state == 'pendiente'" class="card-text"> Estado: <span class='badge bg-danger'>{{
                                task.state }}</span></p>
                            <p v-if="task.state == 'en progreso'" class="card-text">Estado: <span
                                    class='badge bg-warning'>{{ task.state }}</span></p>
                            <p v-if="task.state == 'completada'" class="card-text"> Estado: <span
                                    class='badge bg-success'>{{ task.state }}</span></p>
                            <p class="card-text">titulo del Proyecto: {{ task.nameProject }}</p>
                            <p v-if="task.nameUser == null" class="card-text">Responsable: <span class='badge bg-danger'>No
                                    tiene</span> </p>
                            <p v-else class="card-text">Responsable: <span class='badge bg-info'>{{ task.nameUser }}</span>
                            </p>

                        </div>

                        <div class="card-footer">
                            <div class="d-flex gap-5">
                                <button @click="handleGetById(task.id)" data-bs-toggle="modal"
                                    data-bs-target="#exampleModal3" class="btn btn-outline-warning "> Actualizar</button>
                                <button v-if="profile.id_rol == '1'" @click="handleDelete(task.id)" class="btn btn-outline-danger"> Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <!-- ===========================================      Formulario de registro papu  ================= -->

    </div>

    <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight2" aria-labelledby="offcanvasRightLabel">
        <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasRightLabel">Registro de nuevas Tareas</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
            <div class="align-items-center justify-content-between flex-wrap gap-2">
                <form @submit="handleRegister">
                    <div class="mb-3">
                        <label for="exampleFormControlInput1" class="form-label">Titulo de la Tarea:</label>
                        <input v-model="title" type="text" class="form-control" id="exampleFormControlInput1"
                            placeholder="Ingrese un Titulo">
                    </div>
                    <div class="mb-3">
                        <label for="exampleFormControlInput1" class="form-label">Descripción de la tarea</label>
                        <input v-model="desc" type="text" class="form-control" id="exampleFormControlInput1"
                            placeholder="Ingrese la descripcion de la tarea">
                    </div>
                    <div class="mb-3">
                        <label for="exampleFormControlInput1" class="form-label">Estado: </label>
                        <select v-model="state" class="form-select" aria-label="Default select example">
                            <option value="pendiente">Pendiente</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="exampleFormControlInput1" class="form-label">Proyecto correspondiente</label>
                        <select v-model="id_project" class="form-select" aria-label="Default select example">
                            <!-- <option selected>Open this select menu</option> -->
                            <option v-for="project in dataProjects" :value="project.id">{{ project.projectTitle }}</option>
                        </select>
                    </div>
                    <!-- <div class="mb-3">
                        <label for="exampleFormControlInput1" class="form-label">Usuario correspondiente</label>
                        <select v-model="id_user" class="form-select" aria-label="Default select example">
                            <option value=""></option>
                            <option v-for="user in dataUsers" :value="user.id">{{ user.name }}</option>
                        </select>
                    </div> -->
                    <center>
                        <button type="submit" data-bs-dismiss="offcanvas" aria-label="Close" class="btn btn-outline-success btn-lg">Registrar</button>
                    </center>

                </form>
            </div>
        </div>
        <div class="offcanvas-footer">
            @SOFTWARE MYS
        </div>
    </div>

    <!-- Modal    Actualizarrrrr Tareaaaaaaaaaaaaa    -->
    <div class="modal fade" id="exampleModal3" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Actualizar Tarea</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form @submit="handleUpdate">
                        <input v-model="idU" type="hidden" name="" id="">
                        <div class="mb-3">
                            <label for="exampleFormControlInput1" class="form-label">Titulo de la Tarea:</label>
                            <input v-model="titleU" type="text" class="form-control" id="exampleFormControlInput1"
                                placeholder="Ingrese un Titulo">
                        </div>
                        <div class="mb-3">
                            <label for="exampleFormControlInput1" class="form-label">Descripción de la tarea</label>
                            <input v-model="descU" type="text" class="form-control" id="exampleFormControlInput1"
                                placeholder="Ingrese la descripcion de la tarea">
                        </div>
                        <div class="mb-3">
                            <label for="exampleFormControlInput1" class="form-label">Estado: </label>
                            <select v-model="stateU" class="form-select" aria-label="Default select example">
                                <!-- <option selected>Pendiente</option> -->
                                <option value="pendiente">Pendiente</option>
                                <option value="en progreso">En proceso</option>
                                <option value="completada">Completada</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="exampleFormControlInput1" class="form-label">Proyecto correspondiente</label>
                            <select v-if="profile.id_rol == '1'" v-model="id_projectU" class="form-select" aria-label="Default select example">
                                <option v-for="project in dataProjects" :value="project.id">{{ project.projectTitle }}
                                </option>
                            </select>
                            <select v-else v-model="id_projectU" class="form-select" aria-label="Default select example" disabled>
                                <option v-for="project in dataProjects" :value="project.id">{{ project.projectTitle }}
                                </option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="exampleFormControlInput1" class="form-label">Usuario correspondiente</label>
                            <select v-if="profile.id_rol == '1'" v-model="id_userU" class="form-select" aria-label="Default select example">
                                <!-- <option selected>Open this select menu</option> -->
                                <option value=""></option>
                                <option v-for="user in dataUsers" :value="user.id">{{ user.name }}</option>
                            </select>
                            <select  v-else v-model="id_userU" class="form-select" aria-label="Default select example" disabled>
                                <!-- <option selected>Open this select menu</option> -->
                                <option value=""></option>
                                <option v-for="user in dataUsers" :value="user.id">{{ user.name }}</option>
                            </select>
                        </div>
                        <center>
                            <button data-bs-dismiss="modal" type="submit" class="btn btn-outline-warning btn-lg">Actualizar</button>
                        </center>

                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>