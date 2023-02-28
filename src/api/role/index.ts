import request from '@/config/axios'

import type { RoleInfo } from './types'

export const changePwd = (data): Promise<IResponse<RoleInfo>> => {
  console.log('changePwd params ==>', data)
  return request.put({ url: 'role', data: data })
}

export const getTableListApi = (params: any): Promise<IResponse> => {
  console.log('getTableListApi params==>', params)
  return request.get({ url: 'role', params })
}

export const getRoleSelectDataApi = (params: any): Promise<IResponse<RoleInfo>> => {
  console.log('getTableListApi params==>', params)
  return request.get({ url: 'role/component', params })
}

export const updateTableApi = (id, params: any): Promise<IResponse> => {
  return request.put({ url: `role/${id}`, data: params })
}

export const saveTableApi = (params: any): Promise<IResponse> => {
  return request.post({ url: 'role', data: params })
}

export const delTableListApi = (params: any): Promise<IResponse> => {
  return request.delete({
    url: 'role',
    data: {
      roles: params
    }
  })
}

export const disableApi = (id, params: any): Promise<IResponse> => {
  return request.put({ url: `role/${id}/status`, data: params })
}

export const putRoleMenuApi = (id, params: any): Promise<IResponse> => {
  return request.put({
    url: `role/${id}/menu`,
    data: {
      menus: params
    }
  })
}
