import request from '@/config/axios'
import type { UserType } from './types'

interface RoleParams {
  roleName: string
}

export const loginApi = (data: UserType): Promise<IResponse<UserType>> => {
  return request.post({ url: '/user/login', data })
}

export const loginOutApi = (): Promise<IResponse> => {
  return request.get({ url: '/user/loginOut' })
}

export const getUserListApi = ({ params }: AxiosConfig) => {
  return request.get<{
    total: number
    list: UserType[]
  }>({ url: '/user/list', params })
}

export const getRoelMenusApi = (): Promise<IResponse<AppCustomRouteRecordRaw[]>> => {
  return request.get({ url: '/authorization/menus' })
}
