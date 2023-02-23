<script setup lang="ts">
import { useDesign } from '@/hooks/web/useDesign'
import { ElRow, ElCol, ElUpload, ElIcon, ElDialog, UploadFiles } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { ref, unref, watch } from 'vue'
import { propTypes } from '@/utils/propTypes'
import type { UploadFile } from 'element-plus'
import { PATH_URL } from '@/config/axios/service'
import type { UploadUserFile } from 'element-plus'
import { useCache } from '@/hooks/web/useCache'
import { useAppStoreWithOut } from '@/store/modules/app'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('sm-uplaod')
const fileList = ref<UploadUserFile[]>([])
const props = defineProps({
  // 是否显示密码强度
  modelValue: [String, Array],
  multiple: propTypes.bool.def(true),
  showFileList: propTypes.bool.def(true),
  listType: propTypes.string.def('picture-card'),
  limit: propTypes.number.def(10)
})
// 输入框的值
const valueRef = ref([])

console.log('props.modelValue==>', props.modelValue)
watch(
  () => props.modelValue,
  (val: any) => {
    console.log('modelValue change==>', val)
    if (val === unref(valueRef)) return
    valueRef.value = val
    fileList.value = typeof val == 'string' ? [{ name: val, url: val }] : val
  },
  {
    deep: true,
    immediate: true
  }
)

const emit = defineEmits(['update:modelValue'])

// 监听
watch(
  () => valueRef.value,
  (val: Object) => {
    console.log(`change valueRef value `, val)
    emit('update:modelValue', val)
  },
  {
    deep: true,
    immediate: false
  }
)

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const uploadSuccessArray = ref([])

const onSuccess = (response: any, _: UploadFile) => {
  uploadSuccessArray.value.push(response.data)
  valueRef.value = uploadSuccessArray
}

const onRemove = (removeFile: UploadFile, uploadFiles: UploadFiles) => {
  console.log(removeFile, uploadFiles, uploadSuccessArray)
  uploadSuccessArray.value = uploadSuccessArray.value.filter((item) => {
    return item.name != removeFile.name
  })
  console.log(uploadSuccessArray)
  valueRef.value = uploadSuccessArray
}

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}

const { wsCache } = useCache()
const appStore = useAppStoreWithOut()
const uploadUrl = ref(`${PATH_URL}/file/upload`)
const userInfo = wsCache.get(appStore.getUserInfo)
</script>

<template>
  <div :class="`${prefixCls}-sm-uplaod`">
    <ElRow>
      <ElCol :span="24">
        <ElUpload
          :limit="limit"
          :list-type="listType"
          :auto-upload="true"
          :show-file-list="showFileList"
          :headers="{ Authorization: `Bearer ${userInfo?.token}` }"
          :action="uploadUrl"
          accept="image/*,.png, .jpg, .jpeg"
          :multiple="multiple"
          :with-credentials="true"
          :file-list="fileList"
          :on-preview="handlePictureCardPreview"
          :on-success="onSuccess"
          :on-remove="onRemove"
        >
          <ElIcon><Plus /></ElIcon>
        </ElUpload>

        <ElDialog v-model="dialogVisible">
          <img w-full :src="dialogImageUrl" alt="Preview Image" />
        </ElDialog>
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
