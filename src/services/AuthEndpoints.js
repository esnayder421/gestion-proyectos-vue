import axios from "axios";
import {global} from './../models/model.js'

const url = global.urlApi

export const Auth = async (credentials) => {
    const response =  await axios.post(url + "/auth/login", credentials)
    // console.log(response)
    return response.data
}

export const Me = async (token) => {
    const response =  await axios.post(url + "/auth/me",{},{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    // console.log(response.data)
    return response.data
}





