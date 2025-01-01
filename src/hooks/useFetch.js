import axios from "axios"
import { useState } from "react"

const useFetch = () => {
  const [apiData, setApiData] = useState()
  const getApi = (url, token)=>{
    axios.get(url, token)
    .then(res=> setApiData(res.data))
    .catch(err=>console.log(err))
  }
  return [apiData, getApi]
}

export default useFetch