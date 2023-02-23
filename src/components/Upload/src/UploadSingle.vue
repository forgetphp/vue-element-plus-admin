<script setup lang="ts">
import { useDesign } from '@/hooks/web/useDesign'
import { ElUpload, ElIcon } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import { ref, unref, watch } from 'vue'
import { propTypes } from '@/utils/propTypes'
import type { UploadFile } from 'element-plus'
import { PATH_URL } from '@/config/axios/service'
import type { UploadUserFile } from 'element-plus'
import { useRoute } from 'vue-router'
import { useCache } from '@/hooks/web/useCache'
import { useAppStoreWithOut } from '@/store/modules/app'

const { query } = useRoute()
const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('suplaod')
const fileListSingle = ref<UploadUserFile[]>([])
const props = defineProps({
  modelValue: propTypes.string.def('')
})

const valueSignleRef = ref('')
const isEditRemove = ref(false)

watch(
  () => props.modelValue,
  (val: string) => {
    if (val === unref(valueSignleRef)) return

    // 编辑时如果其它组件发生数据改变后防止已经编辑过的数据在次被老数据覆盖
    if (isEditRemove.value && query.id) {
      console.log('upload single modelValue isEditRemove', val)
      emit('update:modelValue', '')
      return
    }

    console.log('upload single modelValue', val)
    valueSignleRef.value = val
    fileListSingle.value = [
      {
        name: val,
        url: val
      }
    ]
  }
)

const emit = defineEmits(['update:modelValue'])

// 监听
watch(
  () => valueSignleRef.value,
  (val: Object) => {
    console.log(`upload single change valueRef value ${val}`)
    emit('update:modelValue', val)
  },
  {
    deep: true,
    immediate: false
  }
)

const onSuccessSingle = (response: any, _: UploadFile) => {
  console.log(response)
  valueSignleRef.value = response.data.url
}

const onRemoveSingle = (_: UploadFile) => {
  isEditRemove.value = !isEditRemove.value
  valueSignleRef.value = ''
  fileListSingle.value = []
}

const uploadUrl = ref(`${PATH_URL}/file/upload`)
const { wsCache } = useCache()
const appStore = useAppStoreWithOut()
const userInfo = wsCache.get(appStore.getUserInfo)
</script>

<template>
  <div :class="`${prefixCls}-slaod`">
    <ElUpload
      style="width: 100%"
      list-type="picture"
      :headers="{ Authorization: `Bearer ${userInfo?.token}` }"
      :auto-upload="true"
      :action="uploadUrl"
      accept="image/*,.png, .jpg, .jpeg"
      :multiple="false"
      :with-credentials="false"
      :file-list="fileListSingle"
      :on-success="onSuccessSingle"
      :on-remove="onRemoveSingle"
      :limit="1"
      drag
    >
      <ElIcon class="el-icon--upload"><UploadFilled /></ElIcon>
      <div class="el-upload__text"> 将文件拖到此处或 <em>点击上传</em> </div>
      <template #tip>
        <div class="el-upload__tip"> jpg/png files with a size less than 500kb </div>
      </template>
    </ElUpload>
  </div>
</template>
<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-suplaod';
.@{prefix-cls} {
  width: 100%;
  border: 1px solid blue;
}
</style>
