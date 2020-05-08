const fetchAPI = async (reqObj) => {
  try {
    const res = await window.fetch(reqObj.url, reqObj.init)
    const data = await res.json()

    if (res.status === 200 || res.status === 201) {
      return data
    } else if (res.status === 500) {
      //  showError(res.status, data)
      return null
    } else if (res.status === 404) {
      //  showError(res.status, data)
      return null
    }
  } catch (error) {
    console.log(error)
  }
}

export const baseURL = 'http://localhost:3000/tasks'
export { fetchAPI }
