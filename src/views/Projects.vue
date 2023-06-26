<script setup>
import Navbar from '../components/Navbar.vue'
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { GetProjets, registerProject, deleteProject, getByIdProject, updateProject } from '../services/ProjectEndpoints.js'
import ProgressBar from '../../node_modules/vue-progress-bar-loader/src/components/progress-bar.vue'
import {Me} from '../services/AuthEndpoints'
import router from "@/router";


let data = ref({})
let profile = ref({})

let title = ref('')
let desc = ref('')
let initialDate = ref('')
let finalDate = ref('')
let titleU = ref('')
let descU = ref('')
let initialDateU = ref('')
let finalDateU = ref('')
let idU = ref('')

let loader = ref(false)

const token = $cookies.get('token')

onMounted(async () => {

    try {
        loader.value = true
        const getProfile = await Me(token)
        profile.value = getProfile
        console.log(profile.value)
        const getData = async () => {
        const response = await GetProjets(token)
        // console.log(response)
            return response
        }
        const d = await getData()
        data.value = d
        loader.value = false


    } catch (error) {
        console.log(error)
        toast("Ocurrio un Error Inicia Sesion nuevamente!","error")
        router.replace("/");
    }


})
const routeter = useRoute()
let idr = routeter.params.id
console.log(idr + "sdlfvndflñgj")

const handleRegister = async (e) => {
    e.preventDefault()
    try {
        console.log(title.value, desc.value, initialDate.value, finalDate.value)
        const responseRegister = await registerProject(token, { "title": title.value, "desc": desc.value, "initialDate": initialDate.value, "finalDate": finalDate.value })
        const responseGet = await GetProjets(token)
        data.value = responseGet
        toast("Registro Exitoso!","success")
    } catch (error) {
        console.log(error)
        toast("Ocurrio un Error Intentelo nuevamente!","error")
    }

}
const handleDelete = async (id) => {
    try {
        const responseDelete = await deleteProject(token, id)
        const responseGet = await GetProjets(token)
        data.value = responseGet
        toast("Se elimino correctamente!","success")
    } catch (error) {
        toast("Ocurrio un Error Intentelo nuevamente!","error")
    }
}


const handleGetByid = async (id) =>{
    loader.value = true

    console.log(id)
    const responseGetById = await getByIdProject(token, id)

    titleU.value = responseGetById.projectTitle
    descU.value = responseGetById.projectDesc
    initialDateU.value = responseGetById.initialDate
    finalDateU.value = responseGetById.finalDate
    idU.value = responseGetById.id

    loader.value = false
}
const handleUpdate = async (e) =>{
    e.preventDefault()
    try {
        const id = idU.value
        const dataUpdate = { "title": titleU.value, "desc": descU.value, "initialDate": initialDateU.value, "finalDate": finalDateU.value }
        const responseUpdate = await updateProject(token, id, dataUpdate)
        const responseGet = await GetProjets(token)
        data.value = responseGet
        toast("Se actualizo correctamente!","success")
    } catch (error) {
        toast("Ocurrio un Error Intentelo nuevamente!","error")
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
            <h1>Proyectos</h1>
        </div>
        <hr>
        <div class="p-4">
            <button v-if="profile.id_rol =='1'" class="btn btn-info" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample"
                aria-controls="offcanvasExample">
                Registrar nuevo Proyecto
            </button>
            <button v-else class="btn btn-info" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample"
                aria-controls="offcanvasExample" disabled>
                Registrar nuevo Proyecto
            </button>
        </div>
        
        <div v-if="loader">
            <ProgressBar :duration="7000" :messages="['loading']" :width="30"/>
        </div>
        <div v-else class="align-items-center d-flex justify-content-between flex-wrap gap-4">

            <div class="" v-for="project in data">
                <div v-bind:key="project.id">
                    <!-- <CardProject :project="project" /> -->
                    <div class="card" style="width: 18rem;">
                        <div class="card-header">
                            <h5 class="card-title">Titulo: {{ project.projectTitle }}</h5>

                        </div>
                        <div class="card-body">
                            <!-- <h6 class="card-subtitle mb-2 text-body-secondary">Card subtitle</h6> -->
                            <p class="card-text">Descripción: {{ project.projectDesc }}</p>
                            <p class="card-text">Fecha de Inicio: {{ project.initialDate }}</p>
                            <p class="card-text">Fecha final: {{ project.finalDate }}</p>
                        </div>

                        <div class="card-footer">
                            <div class="d-flex gap-5">
                                <button v-if="profile.id_rol =='1'" @click="handleGetByid(project.id)" data-bs-toggle="modal" data-bs-target="#exampleModal"
                                    class="btn btn-outline-warning "> Actualizar</button>
                                <button v-if="profile.id_rol =='1'" @click="handleDelete(project.id)" class="btn btn-outline-danger"> Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


       


        <!-- ==============================   Actualizar ======================================== -->
        <!-- Modal -->
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div v-if="loader">
                        <ProgressBar :duration="7000" :messages="['loading']" :width="30"/>
                    </div>
                    <div v-else>
                        <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Actualizar Proyectos</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit="handle">
                            <input v-model="idU" type="hidden">
                            <div class="mb-3">
                                <label for="exampleFormControlInput1" class="form-label">Titulo del Proyecto:</label>
                                <input v-model="titleU" type="text" class="form-control" id="exampleFormControlInput1"
                                    placeholder="ingrese el titulo del proyecto">
                            </div>
                            <div class="mb-3">
                                <label for="exampleFormControlInput1" class="form-label">Descripción del Proyecto:</label>
                                <input v-model="descU" type="text" class="form-control" id="exampleFormControlInput1"
                                    placeholder="ingrese una descripción">
                            </div>
                            <div class="mb-3">
                                <label for="exampleFormControlInput1" class="form-label">Fehca de Inicio:</label>
                                <input v-model="initialDateU" type="date" class="form-control" id="exampleFormControlInput1">
                            </div>
                            <div class="mb-3">
                                <label for="exampleFormControlInput1" class="form-label">Fecha Final:</label>
                                <input v-model="finalDateU" type="date" class="form-control" id="exampleFormControlInput1">
                            </div>
                            <center>
                                <button @click="handleUpdate" data-bs-dismiss="modal" type="submit"
                                    class="btn btn-outline-warning">Atualizar</button>
                            </center>
                        </form>
                    </div>
                    </div>
                    
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
</div>

<div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
            <div class="offcanvas-header">
                <h5 class="offcanvas-title" id="offcanvasExampleLabel">Registro de Proyectos</h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
                <form @submit="handleRegister">
                    <div class="mb-3">
                        <label for="exampleFormControlInput1" class="form-label">Titulo del Proyecto:</label>
                        <input v-model="title" type="text" class="form-control" id="exampleFormControlInput1"
                            placeholder="ingrese el titulo del proyecto">
                    </div>
                    <div class="mb-3">
                        <label for="exampleFormControlInput1" class="form-label">Descripción del Proyecto:</label>
                        <input v-model="desc" type="text" class="form-control" id="exampleFormControlInput1"
                            placeholder="ingrese una descripción">
                    </div>
                    <div class="mb-3">
                        <label for="exampleFormControlInput1" class="form-label">Fehca de Inicio:</label>
                        <input v-model="initialDate" type="date" class="form-control" id="exampleFormControlInput1">
                    </div>
                    <div class="mb-3">
                        <label for="exampleFormControlInput1" class="form-label">Fecha Final:</label>
                        <input v-model="finalDate" type="date" class="form-control" id="exampleFormControlInput1">
                    </div>
                    <center>
                        <button data-bs-dismiss="offcanvas" aria-label="Close" type="submit"
                            class="btn btn-outline-success">Registrar</button>
                    </center>
                </form>
            </div>
        </div>
</template>