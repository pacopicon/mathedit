import axios from 'axios';
import { API_URL } from './mathUtils/VARS';
import streamToBlob from 'stream-to-blob'

export const postToBE = (payload, route, callback) => {
  return axios.post(
    `${API_URL}${route}`, 
    payload
    ).then( async response => {
      const string = response.data.data
      // console.log('string = ', string)
        // streamToBlob(stream, 'application/pdf').then( blob => {
          // console.log('blob = ', blob)
        // })
        // callback(null, response.data)
        // console.log('response.data = ', response.data)
        callback(null, string)
     
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

