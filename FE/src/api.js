import axios from 'axios';
const url = 'http://localhost:4000/api/'
const route = 'mathHtml'

const axiosPost = (latexStr, callback) => {
  const payload = {}
  payload.latexStr = latexStr
  return axios.post(
    `${url}${route}`, 
    payload
    ).then( response => {
      const { success, html } = response.data
      if (success) {
        callback(null, html)
      } else {
        const err = 'Error, success = false'
        callback(err)
      }
    }).catch(err => {
      callback(err)
    })
}

export default axiosPost;