<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Dialog } from '@/components/Dialog'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElImage, ElMessage, ElSwitch } from 'element-plus'
import { Table } from '@/components/Table'
import {
  getTableListApi,
  saveTableApi,
  delTableListApi,
  disableAdminApi,
  updateTableApi
} from '@/api/admin'
import { useTable } from '@/hooks/web/useTable'
import { AdminInfo } from '@/api/admin/type'
import { h, ref, unref, reactive } from 'vue'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'

const { register, tableObject, methods } = useTable<AdminInfo>({
  getListApi: getTableListApi,
  delListApi: delTableListApi,
  response: {
    list: 'data',
    total: 'total'
  },
  defaultParams: {
    title: ''
  }
})

const { getList, setSearchParams } = methods

getList()

const { t } = useI18n()

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'id',
    label: t('adminstrator.id'),
    form: {
      show: false
    },
    detail: {
      show: false
    }
  },
  {
    field: 'username',
    label: t('adminstrator.username'),
    form: {
      colProps: {
        span: 24
      }
    },
    detail: {
      span: 24
    }
  },
  {
    field: 'nickname',
    label: t('adminstrator.nickname'),
    search: {
      show: true
    },
    form: {
      colProps: {
        span: 24
      }
    },
    detail: {
      span: 24
    }
  },
  // {
  //   field: 'password',
  //   show: false,
  //   label: t('adminstrator.password'),
  //   form: {
  //     colProps: {
  //       span: 24
  //     }
  //   },
  //   detail: {
  //     span: 24
  //   }
  // },
  {
    field: 'phone',
    label: t('adminstrator.phone'),
    form: {
      colProps: {
        span: 24
      }
    },
    detail: {
      span: 24
    }
  },
  {
    field: 'email',
    label: t('adminstrator.email'),
    form: {
      colProps: {
        span: 24
      },
      componentProps: {
        disabled: false
      }
    },
    detail: {
      span: 24
    }
  },
  {
    field: 'state',
    label: t('adminstrator.state'),
    formatter: (record: Recordable, __: TableColumn, cellValue: number) => {
      // 状态： 0 = no 1= yes
      return h(ElSwitch, {
        activeText: '是',
        inactiveText: '否',
        inlinePrompt: true,
        modelValue: cellValue,
        // loading: loadingReq,
        activeValue: 1,
        inactiveValue: 0,
        beforeChange: () => {
          return new Promise((resolve) => {
            disableAdminApi(record.id, { state: cellValue == 0 ? 1 : 0 })
              .then((res) => {
                ElMessage({
                  message: res.msg,
                  type: 'success'
                })
                getList()
              })
              .catch((err) => {
                console.log(err)
              })
            return resolve(true)
          })
        }
      })
    },
    form: {
      component: 'Select',
      colProps: {
        span: 24
      },
      componentProps: {
        style: {
          width: '100%'
        },
        options: [
          {
            label: '禁用',
            value: 1
          },
          {
            label: '启用',
            value: 0
          }
        ]
      },
      value: 0
    }
  },

  {
    field: 'avatar',
    label: t('adminstrator.avatar'),
    formatter: (_: Recordable, __: TableColumn, cellValue: string) => {
      return h(ElImage, {
        src: cellValue,
        previewSrcList: [cellValue],
        lazy: true,
        previewTeleported: true,
        style: {
          width: '50px',
          height: '50px'
        }
      })
    },
    form: {
      colProps: {
        span: 24
      },
      component: 'SMUpload',
      componentProps: {
        multiple: false,
        showFileList: true,
        listType: 'picture-card',
        limit: 1
      },
      value: ''
    },
    detail: {
      span: 24
    }
  },

  {
    field: 'action',
    width: '260px',
    label: t('tableDemo.action'),
    form: {
      show: false
    },
    detail: {
      show: false
    }
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const dialogVisible = ref(false)

const dialogTitle = ref('')

const isFirstAdd = ref(false)
const pushPwdComponent = () => {
  if (!isFirstAdd.value) {
    isFirstAdd.value = true
    allSchemas.formSchema.push({
      field: 'password',
      label: t('adminstrator.password'),
      component: 'Input',
      colProps: {
        span: 24
      }
    })
  }
}

const disableUsernameFiled = () => {
  const isDisable = actionType.value == 'edit'
  allSchemas.formSchema.map((item) => {
    if (item.field == 'username') {
      item.componentProps = {
        disabled: isDisable
      }
    }

    return item
  })
}

const AddAction = () => {
  pushPwdComponent()
  disableUsernameFiled()
  dialogTitle.value = t('exampleDemo.add')
  tableObject.currentRow = null
  dialogVisible.value = true
  actionType.value = ''
}

const delLoading = ref(false)

const delData = async (row: AdminInfo | null, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  delLoading.value = true
  await delList(
    multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as string],
    multiple
  ).finally(() => {
    delLoading.value = false
  })
}

const actionType = ref('')

const action = (row: AdminInfo, type: string) => {
  dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail')
  actionType.value = type
  tableObject.currentRow = row
  pushPwdComponent()
  disableUsernameFiled()
  dialogVisible.value = true
}

const writeRef = ref<ComponentRef<typeof Write>>()

const loading = ref(false)

const save = async () => {
  const write = unref(writeRef)
  await write?.elFormRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      const data = (await write?.getFormData()) as AdminInfo
      switch (actionType.value) {
        case 'edit':
          const eres = await updateTableApi(data.id, data)
            .catch(() => {})
            .finally(() => {
              loading.value = false
            })
          if (eres) {
            dialogVisible.value = false
            tableObject.currentPage = 1
            getList()
          }
          break
        default:
          const res = await saveTableApi(data)
            .catch(() => {})
            .finally(() => {
              loading.value = false
            })
          if (res) {
            dialogVisible.value = false
            tableObject.currentPage = 1
            getList()
          }
          break
      }
    }
  })
}
</script>

<template>
  <ContentWrap>
    <Search
      :model="{}"
      :schema="allSchemas.searchSchema"
      @search="setSearchParams"
      @reset="setSearchParams"
    />

    <div class="mb-10px">
      <ElButton type="primary" @click="AddAction">{{ t('exampleDemo.add') }}</ElButton>
      <ElButton :loading="delLoading" type="danger" @click="delData(null, true)">
        {{ t('exampleDemo.del') }}
      </ElButton>
    </div>

    <Table
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :columns="allSchemas.tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :pagination="{
        total: tableObject.total
      }"
      @register="register"
    >
      <template #action="{ row }">
        <ElButton type="primary" @click="action(row, 'edit')">
          {{ t('exampleDemo.edit') }}
        </ElButton>
        <ElButton type="success" @click="action(row, 'detail')">
          {{ t('exampleDemo.detail') }}
        </ElButton>
        <ElButton type="danger" @click="delData(row, false)">
          {{ t('exampleDemo.del') }}
        </ElButton>
      </template>
    </Table>
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <Write
      v-if="actionType !== 'detail'"
      ref="writeRef"
      :form-schema="allSchemas.formSchema"
      :current-row="tableObject.currentRow"
    />

    <Detail
      v-if="actionType === 'detail'"
      :detail-schema="allSchemas.detailSchema"
      :current-row="tableObject.currentRow"
    />

    <template #footer>
      <ElButton v-if="actionType !== 'detail'" type="primary" :loading="loading" @click="save">
        {{ t('exampleDemo.save') }}
      </ElButton>
      <ElButton @click="dialogVisible = false">{{ t('dialogDemo.close') }}</ElButton>
    </template>
  </Dialog>
</template>
