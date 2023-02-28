import { service } from './service'

import { config } from './config'
import { useAppStoreWithOut } from '@/store/modules/app'
import { useCache } from '@/hooks/web/useCache'
const { wsCache } = useCache()
const appStore = useAppStoreWithOut()

const { default_headers } = config

const request = (option: any) => {
  const { url, method, params, data, headersType, responseType } = option
  // 每次地需要重新获取新值
  const userInfo = wsCache.get(appStore.getUserInfo)
  return service({
    url: url,
    method,
    params,
    data,
    responseType: responseType,
    headers: {
      'Content-Type': headersType || default_headers,
      Authorization: `Bearer ${userInfo?.token}`
    }
  })
}
export default {
  get: <T = any>(option: any) => {
    return request({ method: 'get', ...option }) as unknown as T
  },
  post: <T = any>(option: any) => {
    return request({ method: 'post', ...option }) as unknown as T
  },
  delete: <T = any>(option: any) => {
    return request({ method: 'delete', ...option }) as unknown as T
  },
  put: <T = any>(option: any) => {
    return request({ method: 'put', ...option }) as unknown as T
  }
}
