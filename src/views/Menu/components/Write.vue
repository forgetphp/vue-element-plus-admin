<script setup lang="ts">
import { Form } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch } from 'vue'
import { MenuInfo } from '@/api/menus/types'
import { useValidator } from '@/hooks/web/useValidator'
import { FormSchema } from '@/types/form'
import { useI18n } from '@/hooks/web/useI18n'
import { Infotip } from '@/components/Infotip'
import { includes } from 'lodash-es'

const { t } = useI18n()
const { required } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object as PropType<Nullable<MenuInfo>>,
    default: () => null
  },
  formSchema: {
    type: Array as PropType<FormSchema[]>,
    default: () => []
  },
  actionType: {
    type: String,
    default: ''
  }
})

const rules = reactive({
  name: [required()],
  display_name: [required()]
})

const { register, methods, elFormRef } = useForm({
  schema: props.formSchema
})

watch(
  () => props.currentRow,
  (currentRow) => {
    props.formSchema.map((item) => {
      switch (item.field) {
        case 'pid':
          console.log('current row ==> ', currentRow)
          if (['addsub'].includes(props.actionType)) {
            item.componentProps.modelValue = currentRow?.id
            item.componentProps.value = currentRow?.id
          } else {
            item.componentProps.modelValue = currentRow?.pid
            item.componentProps.value = currentRow?.pid
          }
          // const { setValues } = methods

          console.log(item.componentProps)
          // setValues(currentRow)

          console.log(['addsub'].includes(props.actionType), props.actionType)
          break
      }
      return item
    })
    if (!currentRow) return
    console.log('menu edit ==>', currentRow)
    const { setValues } = methods

    setValues(currentRow)
  },
  {
    deep: true,
    immediate: true
  }
)

defineExpose({
  elFormRef,
  getFormData: methods.getFormData
})
</script>

<template>
  <Infotip :show-index="false" :title="`${t('menus.tips')}`" :schema="[]" />
  <Form :rules="rules" label-position="top" @register="register" />
</template>
