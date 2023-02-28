<script setup lang="ts">
import { useDesign } from '@/hooks/web/useDesign'
import { ElInput, ElRow, ElCol } from 'element-plus'
import { ref, watch } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { captchaApi } from '@/api/captcha'
const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('input-captcha')

const props = defineProps({
  // 是否显示密码强度
  strength: propTypes.bool.def(false),
  modelValue: propTypes.object.def({
    key: '',
    code: ''
  })
})
// 输入框的值
const valueRef = ref({
  key: '',
  code: ''
})

watch(
  () => props.modelValue,
  (val: Object) => {
    console.log(`modelValue is change ${val}`)

    if (val.key === '' && val.code === '') {
      if (!loading.value) {
        getCaptcha()
      }

      valueRef.value.key = val.key
      valueRef.value.code = val.code
    }

    console.log(`modelValue is change ${val}`)
  }
)

const emit = defineEmits(['update:modelValue'])
const captchaBase64String = ref('')

const loading = ref(false)
const getCaptcha = () => {
  loading.value = true
  captchaApi().then(({ data }) => {
    console.log(data)
    loading.value = false
    valueRef.value.key = data.key
    captchaBase64String.value = data.img
  })
}
getCaptcha()
// 监听
watch(
  () => valueRef.value,
  (val: Object) => {
    console.log(`change valueRef value ${val}`)
    emit('update:modelValue', val)
  },
  {
    deep: true,
    immediate: false
  }
)
</script>

<template>
  <div :class="`${prefixCls}-input-captcha`">
    <ElRow>
      <ElCol :span="18">
        <ElInput v-model="valueRef.code" />
      </ElCol>
      <ElCol :span="6">
        <img :class="`${prefixCls}__img`" :src="captchaBase64String" @click="getCaptcha" alt="" />
      </ElCol>
    </ElRow>
  </div>
</template>
<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-input-captcha';
.@{prefix-cls} {
  &__img {
    // border: 1px solid blue;
    margin-top: 5px;
    cursor: pointer;
  }
}
</style>
