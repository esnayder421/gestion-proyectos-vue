<script setup>
import { Auth } from '../services/AuthEndpoints.js'
import {userRegister} from '../services/UserEndpoint.js'
import { ref, onMounted } from 'vue'
import router from "@/router";
import Swal from 'sweetalert2'

let name = ref('')
let emailR = ref('')
let passwordR = ref('')
let email = ref('')
let password = ref('')
//useeffect
onMounted(()=>{

  //optener parametros de la url
  // const routeter = useRoute()
  // routeter.params.id
})


const handleSubmit = async(e) => {

  e.preventDefault()
    try {
      const response = await Auth({"email":email.value, "password":password.value})
      $cookies.set("token",response.access_token)
      console.log($cookies.get('token'))
      toast("Inicio de Sesion exitoso!","success")
      router.push("dashboard/project");
    } catch (error) {
      toast("credenciales no validas!","error")
      console.log(error)
    }
 

  

  emailR.value = ""
  passwordR.value = ""
}

const handleRegister = async(e) =>{
  e.preventDefault()
  try {
    console.log(password.value)
    if(passwordR.value == "" || emailR.value == ""){
      toast("La contraseña o correo no pueden estar vacios!","info")
      return 
    }else{
      const response = await userRegister({"name": name.value, "email": emailR.value, "password": passwordR.value})
      email.value = ""
      password.value = ""

    toast("Registro exitoso!","success")
    }
  } catch (error) {
    
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
  <main>
    <div class="container-fluid position-relative bg-white d-flex p-0">
    <div class="container-fluid">
      <div class="row h-100 align-items-center justify-content-center" style="min-height: 100vh;">
        <div class="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4">
          
            <div class="bg-light rounded p-4 p-sm-5 my-4 mx-3">
              <div class="d-flex align-items-center justify-content-between mb-3">

                <!-- <h3 class="text-primary"><i  class="fa fa-hashtag me-2"></i>DASHMIN</h3> -->
                <img class="img-fluid" src="/img/logo_largo_blancosinf.png" width="200" alt="">

                <h3>Sign In</h3>
              </div>
              <form @submit="handleSubmit" action="">
              <div class="form-floating mb-3">
                <input v-model="email" type="email" name="imail" class="form-control" id="floatingInput"
                  placeholder="name@example.com">
                <label for="floatingInput">Email address</label>
              </div>
              <div class="form-floating mb-4">
                <input v-model="password" type="password" name="password" class="form-control" id="floatingPassword"
                  placeholder="Password" autocomplete="true">
                <label for="floatingPassword">Password</label>
              </div>
              <button type="submit" class="btn btn-primary py-3 w-100 mb-4">Sign In</button>
            </form>
            <p>no cuentas con una cuenta? <button data-bs-toggle="modal" data-bs-target="#exampleModal" class="btn btn-link">Registrate Aquí</button></p> 
            </div>
          
               
        </div>
      </div>
    </div>
  </div>
<!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Registro de Usuarios</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form @submit="handleRegister">
          <div class="mb-3">
            <label for="name" class="form-label">Nombre completo</label>
            <input v-model="name" type="text" class="form-control" id="name" aria-describedby="emailHelp">
          </div>
          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">Correo electronico</label>
            <input v-model="emailR" type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
          </div>
          <div class="mb-3">
            <label for="exampleInputPassword2" class="form-label">Contraseña</label>
            <input v-model="passwordR" type="password" class="form-control" autoComplete="true" id="exampleInputPassword2">
          </div>
          <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="exampleCheck1">
            <label class="form-check-label" for="exampleCheck1">Check me out</label>
          </div>
          <center>
              <button data-bs-dismiss="modal" type="submit" class="btn btn-success btn-lg">Registrar</button>
          </center>
        </form>
      </div>
      <div class="modal-footer ">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
  </main>
</template>
