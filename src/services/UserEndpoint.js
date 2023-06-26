import axios from "axios";
import {global} from './../models/model.js'

const url = global.urlApi

export const userRegister = async (dataRegister) => {
    const response =  await axios.post(url + "/users", dataRegister)
    console.log(response)
    // return response.data
}
export const GetUsers = async (token) => {
    const response =  await axios.get(url + "/users",{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data[0].data
}
export const getByIdUser = async (token, id) => {
    const response =  await axios.get(url + "/users/" + id, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    // console.log(response)
    return response.data
}

export const UpdateUser = async (token, data, id) => {
    const response = await axios.put(url + "/users/" + id, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    console.log(response)
} 