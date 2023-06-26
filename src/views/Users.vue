<script setup>
import ProgressBar from '../../node_modules/vue-progress-bar-loader/src/components/progress-bar.vue'
import Navbar from '../components/Navbar.vue'
import { ref, onMounted } from 'vue'
import { GetUsers, getByIdUser, UpdateUser } from '../services/UserEndpoint.js'
import router from "@/router";

let dataUsers = ref([])
let loader = ref(false)


let name = ref('')
let email = ref('')
let rol = ref('')
let idu = ref('')

const token = $cookies.get('token')
onMounted(async () => {
    try {
        loader.value = true
        const response = await GetUsers(token)
        dataUsers.value = response
        loader.value = false
    } catch (error) {
        router.replace("/");
    }
})

const handleById = async (id) => {
    
    const response = await getByIdUser(token, id)
    name.value = response.name
    email.value = response.email
    rol.value = response.id_rol
    idu.value = response.id

    const responseGet = await GetUsers(token)
    dataUsers.value = responseGet
    
}

const handleUpdate = async (e) =>{
    try {
        loader.value = true
        e.preventDefault();
        const response = await UpdateUser(token,{"name":name.value, "email": email.value, "id_rol":rol.value}, idu.value)
        loader.value = false
        toast("Actualización Exitosa!","success")
    } catch (error) {
        toast("Ocurrio un Error intentalo mas tarde!","error")
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
        <div>
            <h1>Usuarios</h1>
        </div>
        <div v-if="loader">
            <ProgressBar :duration="7000" :messages="['loading']" :width="30" />
        </div>
        <div v-else>
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Nombre Usuario</th>
                        <th scope="col">Correo Electronico</th>
                        <th scope="col">Rol</th>
                        <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody v-for="user in dataUsers">
                    <tr v-bind:key="user.id">
                        <th scope="row">{{ user.id }}</th>
                        <td>{{ user.name }}</td>
                        <td>{{ user.email }}</td>
                        <td v-if="user.id_rol == '1'"><span class='badge bg-primary'>Administrador</span></td>
                        <td v-else><span class='badge bg-secondary'>Miembro</span></td>
                        <td>
                            <button @click="handleById(user.id)" data-bs-toggle="modal" data-bs-target="#staticBackdrop"
                                class="btn btn-info">Actualizar</button>
                            <button class="btn btn-danger">Eliminar</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

    </div>

    <!-- Modal -->
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Actualizar Usuarios</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form @submit="handleUpdate">
                        <input v-model="idu"  type="hidden">
                    <div class="mb-3">
                        <label for="exampleFormControlInput1" class="form-label">Nombres</label>
                        <input v-model="name" type="text" class="form-control" id="exampleFormControlInput1">
                    </div>
                    <div class="mb-3">
                        <label for="exampleFormControlInput1" class="form-label">Correo electronico</label>
                        <input v-model="email" type="text" class="form-control" id="exampleFormControlInput1">
                    </div>
                    <select v-model="rol" class="form-select" aria-label="Default select example">
                            <option value="1"> Administrador </option>
                            <option value="2"> Miembro </option>
                        </select>
                        <center>
                            <button type="submit" data-bs-dismiss="modal" class="btn btn-outline-warning m-4">Actualizar</button>
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