import request from '@/config/axios'

import type { CaptchaType } from './types'

export const captchaApi = (): Promise<IResponse<CaptchaType>> => {
  return request.get({ url: 'captcha/api/math' })
}
