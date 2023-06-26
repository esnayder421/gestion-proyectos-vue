import axios from "axios";
import {global} from './../models/model.js'

const url = global.urlApi

export const GetProjets = async (token) => {
    const response =  await axios.get(url + "/project",{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data[0].data
}

export const registerProject = async (token, data) => {
    const response =  await axios.post(url + "/project",data,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data
}

export const deleteProject = async (token, id) => {

    const response =  await axios.delete(url + "/project/" + id,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    console.log(response)
    return response.data
}
export const updateProject = async (token, id, data) =>{

    const response = await axios.put(url + "/project/" + id, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    console.log(response)
}

export const getByIdProject = async (token, id) =>{
    const response =  await axios.get(url + "/project/" + id,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data
}




