import request from '@/config/axios'

import type { MenuInfo } from './types'

export const getTableListApi = (params: any): Promise<MenuInfo> => {
  console.log('getTableListApi params==>', params)
  return request.get({ url: 'menu', params })
}

export const getMenuOptionApi = (params: any): Promise<MenuInfo> => {
  console.log('getTableListApi params==>', params)
  return request.get({ url: 'menu/option', params })
}

export const updateTableApi = (id, params: any): Promise<IResponse> => {
  return request.put({ url: `menu/${id}`, data: params })
}

export const saveTableApi = (params: any): Promise<IResponse> => {
  return request.post({ url: 'menu', data: params })
}

export const delTableListApi = (params: any): Promise<IResponse> => {
  return request.delete({
    url: 'menu',
    data: {
      menus: params
    }
  })
}

export const disableApi = (id, params: any): Promise<IResponse> => {
  return request.put({ url: `menu/${id}/status`, data: params })
}
