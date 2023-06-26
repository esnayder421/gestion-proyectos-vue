import axios from "axios";
import {global} from './../models/model.js'
import {getByIdProject} from './ProjectEndpoints.js'
import {getByIdUser} from './UserEndpoint.js'





const url = global.urlApi

export const getTasks = async (token) => {
    const resonse = await axios.get(url + "/task", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }) 
    const getData = resonse.data[0].data
    
    const addInformation = await Promise.all(
        getData.map(async(information) =>{

            if(information.id_user == null){
                const nameProject = await getByIdProject(token, information.id_project)
                const name = nameProject.projectTitle
                return{
                    ...information,
                    "nameProject":name,
                    "nameUser":null
                }
            }else{
                const nameUser = await getByIdUser(token, information.id_user)
                const nameProject = await getByIdProject(token, information.id_project)
                    const name = nameProject.projectTitle
                    const userName = nameUser.name
                    return{
                        ...information,
                        "nameProject":name,
                        "nameUser":userName
                    }
            }
        }))
    return addInformation
}



export const taskRegister = async (token, data) =>{
    const response = await axios.post(url + "/task",data,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const taskGetById = async (token, id) =>{
    console.log(url + "/task/" + id)
    const response = await axios.get(url + "/task/" + id,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    
    //console.log(response.data)
    return response.data
}

export const taskUpdate = async (token, data, id) => {
    const response = await axios.put(url + "/task/" + id, data,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    console.log(response)
}


export const taskDelete = async (token, id) => {
    const response =  await axios.delete(url + "/task/" + id,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    console.log(response)
    return response.data
}












