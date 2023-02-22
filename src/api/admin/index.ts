import request from '@/config/axios'

import type { AdminInfo } from './type'

export const changePwd = (data): Promise<IResponse<AdminInfo>> => {
  console.log('changePwd params ==>', data)
  return request.put({ url: 'admin/passwd', data: data })
}

export const changeBasic = (data): Promise<IResponse> => {
  console.log('changeBasic params ==>', data)
  return request.put({ url: 'admin/basic', data: data })
}

export const getUserInfoApi = (): Promise<IResponse> => {
  return request.get({ url: 'admin' })
}
