<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import {
  ElCard,
  ElDescriptions,
  ElDescriptionsItem,
  ElRow,
  ElCol,
  ElTabs,
  ElTabPane,
  ElButton,
  ElMessage,
  ElAvatar
} from 'element-plus'
import { ref, reactive, unref } from 'vue'
import { Form, FormExpose } from '@/components/Form'
import { FormSchema } from '@/types/form'
import { useForm } from '@/hooks/web/useForm'
import { AdminInfo } from '@/api/admin/type'
import { changePwd, changeBasic, getUserInfoApi } from '@/api/admin/index'
import { useCache } from '@/hooks/web/useCache'
import { useAppStoreWithOut } from '@/store/modules/app'
const { wsCache } = useCache()
const appStore = useAppStoreWithOut()
const userInfo = wsCache.get(appStore.getUserInfo).user

const activeItem = ref('first')
const schema = reactive<FormSchema[]>([
  {
    field: 'nickname',
    label: '用户昵称',
    component: 'Input'
  },
  {
    field: 'phone',
    label: '手机号',
    component: 'Input'
  }
])

const { register, methods } = useForm({
  schema
})
const { setValues, getFormData } = methods

setValues(userInfo)
const loading = ref(false)

const save = async () => {
  loading.value = true
  const data = (await getFormData()) as AdminInfo
  console.log(data)
  changeBasic(data)
    .then(async ({ msg }) => {
      loading.value = false
      ElMessage({
        message: msg,
        type: 'success'
      })
      const res = await getUserInfoApi()
      console.log(res)
      const token = wsCache.get(appStore.getUserInfo).token
      wsCache.set(appStore.getUserInfo, {
        user: res.data,
        token: token
      })
      location.href = location.href
    })
    .catch((err) => {
      loading.value = false
      console.log(err)
    })
}

const loadingPwd = ref(false)
const schemaPwd = reactive<FormSchema[]>([
  {
    field: 'password',
    label: '旧密码',
    component: 'Input'
  },
  {
    field: 'new_password',
    label: '新密码',
    component: 'Input'
  },
  {
    field: 'new_password_confirmation',
    label: '确认密码',
    component: 'Input'
  }
])

const formRef = ref<FormExpose>()

const changeBasicAction = async () => {
  loadingPwd.value = true
  const elFormRef = unref(formRef)
  changePwd(elFormRef?.formModel)
    .then(({ msg }) => {
      loadingPwd.value = false
      ElMessage({
        message: msg,
        type: 'success'
      })
    })
    .catch(() => {
      loadingPwd.value = false
    })
}
</script>

<template>
  <ContentWrap>
    <ElRow :gutter="20">
      <ElCol :span="8">
        <ElCard>
          <template #header>
            <div class="card-header">
              <span>个人信息</span>
            </div>
          </template>
          <ElDescriptions :border="true" :column="1">
            <ElDescriptionsItem label="用户名称">{{ userInfo.username }}</ElDescriptionsItem>
            <ElDescriptionsItem label="头像"
              ><ElAvatar :src="userInfo.avatar"
            /></ElDescriptionsItem>
            <ElDescriptionsItem label="手机号码">{{ userInfo.phone }}</ElDescriptionsItem>
            <ElDescriptionsItem label="所属角色">{{ userInfo.rule }}</ElDescriptionsItem>
            <ElDescriptionsItem label="创建日期">{{ userInfo.created_at }}</ElDescriptionsItem>
          </ElDescriptions>
        </ElCard>
      </ElCol>
      <ElCol :span="16">
        <ElCard>
          <template #header>
            <div class="card-header">
              <span>基本资料</span>
            </div>
          </template>
          <ElTabs v-model="activeItem">
            <ElTabPane label="基本资料" name="first">
              <Form :schema="schema" :is-col="false" @register="register" />
              <ElButton @click="save" :loading="loading"> 保存 </ElButton>
            </ElTabPane>
            <ElTabPane label="修改密码" name="second">
              <Form ref="formRef" :schema="schemaPwd" :is-col="false" />
              <ElButton @click="changeBasicAction" :loading="loadingPwd"> 保存 </ElButton>
            </ElTabPane>
          </ElTabs>
        </ElCard>
      </ElCol>
    </ElRow>
  </ContentWrap>
</template>
