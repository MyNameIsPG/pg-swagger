const axios = require('axios')

export const getSwaggerPath = (url: string) => {
  return axios.get(url)
}