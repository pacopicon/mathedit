import axios from 'axios';
import { API_URL } from './mathUtils/VARS';

export const postToBE = (payload, route, callback) => {
  return axios.post(
    `${API_URL}${route}`, 
    payload
    ).then( response => {
        callback(null, response.data)
     
    }).catch(err => {
      callback(err)
    })
}

export const getFileNames = (currFileName, callback) => {
  const route = 'fileNames'
  
  return axios.get(
    `${API_URL}${route}`
    ).then( response => {
      const fileNames     = response.data
      const _fileNames    = [];
      const _currFileName = `${currFileName}.tex`;
      fileNames.map( fileName => {
        if (fileName !== _currFileName) {
          fileName = fileName.replace('.tex', '')
          _fileNames.push(fileName)
        }
      })
      callback(null, _fileNames)
    }).catch(err => {
      callback(err)
    })

}

export const loadFile = (callback) => {
  const route = 'file'
  return axios.post(
    `${API_URL}${route}`
    ).then( response => {
        callback(response.data)
     
    }).catch(err => {
      callback(err)
    })

}

