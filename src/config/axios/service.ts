import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
  AxiosError
} from 'axios'

import qs from 'qs'

import { config } from './config'
import { useCache } from '@/hooks/web/useCache'
import { ElMessage } from 'element-plus'
// import { config } from '@/config/axios/config'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { resetRouter } from '@/router'
import { ElMessageBox } from 'element-plus'
import type { Action } from 'element-plus'
//import { useRouter } from 'vue-router'
import { loginOutApi } from '@/api/login'
const { wsCache } = useCache()

const tagsViewStore = useTagsViewStore()

const { result_code, base_url } = config

export const PATH_URL = base_url[import.meta.env.VITE_API_BASEPATH]

//const { replace } = useRouter() || {}

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: PATH_URL, // api 的 base_url
  timeout: config.request_timeout, // 请求超时时间
  withCredentials: true
})

// request拦截器
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (
      config.method === 'post' &&
      (config.headers as AxiosRequestHeaders)['Content-Type'] ===
        'application/x-www-form-urlencoded'
    ) {
      config.data = qs.stringify(config.data)
    }
    // ;(config.headers as AxiosRequestHeaders)['Authorization'] = `Bearer ${userInfo?.token}`
    // get参数编码
    if (config.method === 'get' && config.params) {
      let url = config.url as string
      url += '?'
      const keys = Object.keys(config.params)
      for (const key of keys) {
        if (config.params[key] !== void 0 && config.params[key] !== null) {
          url += `${key}=${encodeURIComponent(config.params[key])}&`
        }
      }
      url = url.substring(0, url.length - 1)
      config.params = {}
      config.url = url
    }
    return config
  },
  (error: AxiosError) => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    if (response.config.responseType === 'blob') {
      // 如果是文件流，直接过
      return response
    } else if (response.data.code === result_code) {
      return response.data
    } else {
      if (response.data.code == 401) {
        needLogin()
        return
      }
      switch (response.status) {
        case 204:
          break
        default:
          console.log(response)

          ElMessage.error(response.data.msg)
          break
      }
    }
  },
  (error: AxiosError) => {
    console.log('err' + error) // for debug

    switch (error.response?.data.code) {
      case 422:
      case 110101:
        ElMessage.error(error.response?.data.msg)
        break
      case 401:
      case 419:
      case 10043:
        needLogin()
        break
      default:
        console.log(error.response)
        ElMessage.error(error.response?.data.msg)
        //ElMessage.error(error.message)
        break
    }
    return Promise.reject(error)
  }
)

const needLogin = () => {
  ElMessageBox.alert('登录已过期，请重新登录', '提示', {
    // if you want to disable its autofocus
    // autofocus: false,
    confirmButtonText: 'OK',
    callback: (action: Action) => {
      console.log(action)
      loginOutApi()
        .then(() => {
          wsCache.clear()
          tagsViewStore.delAllViews()
          resetRouter() // 重置静态路由表
          //replace('/login')
          location.href = location.href
        })
        .catch(() => {})
    }
  })
}

export { service }
