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

export const getTableListApi = (params: any): Promise<IResponse> => {
  console.log('getTableListApi params==>', params)
  return request.get({ url: 'administrator', params })
}

export const updateTableApi = (id, params: any): Promise<IResponse> => {
  return request.put({ url: `administrator/${id}`, data: params })
}

export const saveTableApi = (params: any): Promise<IResponse> => {
  return request.post({ url: 'administrator', data: params })
}

export const delTableListApi = (params: any): Promise<IResponse> => {
  return request.delete({
    url: 'administrator',
    data: {
      administrator: params
    }
  })
}

export const disableAdminApi = (id, params: any): Promise<IResponse> => {
  return request.put({ url: `administrator/${id}/status`, data: params })
}
