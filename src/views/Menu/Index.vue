<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Dialog } from '@/components/Dialog'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElIcon, ElImage, ElLink, ElMessage, ElSwitch, ElTag } from 'element-plus'
import { Table } from '@/components/Table'
import { useCache } from '@/hooks/web/useCache'
import {
  getTableListApi,
  saveTableApi,
  delTableListApi,
  disableApi,
  getMenuOptionApi,
  updateTableApi
} from '@/api/menus'
import { useTable } from '@/hooks/web/useTable'
import { MenuInfo } from '@/api/menus/types'
import { h, ref, unref, reactive } from 'vue'
import Write from './components/Write.vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
import { Icon } from '@/components/Icon'
import { getRoelMenusApi } from '@/api/login'
import { usePermissionStoreWithOut } from '@/store/modules/permission'

const permissionStore = usePermissionStoreWithOut()

const { wsCache } = useCache()

const { register, tableObject, methods } = useTable<MenuInfo>({
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
    width: '100px',
    label: t('menus.id'),
    form: {
      show: false
    }
  },
  {
    field: 'display_name',
    width: '120px',
    label: t('menus.display_name'),
    search: {
      show: true
    },
    form: {
      labelMessage: t('menus.displaynameLabelMessage'),
      colProps: {
        span: 8
      }
    },
    detail: {
      span: 8
    }
  },
  {
    field: 'icon',
    label: t('menus.icon'),
    form: {
      labelMessage: t('menus.iconLabelMessage'),
      colProps: {
        span: 8
      }
    },
    detail: {
      span: 8
    },
    formatter: (_: Recordable, __: TableColumn, cellValue: string) => {
      return h(Icon, {
        icon: cellValue
      })
    }
  },
  {
    field: 'name',
    label: t('menus.name'),
    width: '100px',
    form: {
      labelMessage: t('menus.nameLabelMessage'),
      colProps: {
        span: 8
      }
    },
    detail: {
      span: 8
    }
  },
  {
    // todo 这里增加的时候需要考虑下是否 ‘/’ 开始。
    field: 'path',
    label: t('menus.path'),
    width: '100px',
    form: {
      colProps: {
        span: 8
      },
      value: '/'
    },
    detail: {
      span: 8
    }
  },
  {
    field: 'is_hidden',
    label: t('menus.is_hidden'),
    search: {
      show: false
    },
    form: {
      colProps: {
        span: 8
      },
      component: 'Select',
      labelMessage: t('menus.isHiddenLabelMessage'),
      componentProps: {
        style: {
          width: '100%'
        },
        options: [
          {
            label: '是',
            value: 1
          },
          {
            label: '否',
            value: 0
          }
        ]
      },
      value: 0
    },
    detail: {
      span: 24
    },
    formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
      return h(
        ElTag,
        {
          type: cellValue == 0 ? 'warning' : 'success'
        },
        () => (cellValue == 0 ? '否' : '是')
      )
    }
  },
  {
    field: 'pid',
    label: t('menus.pid'),
    hidden: true,
    form: {
      api: getMenuOptionApi,
      colProps: {
        span: 8
      },
      component: 'Cascader',
      labelMessage: t('menus.pidLabelMessage'),
      componentProps: {
        style: {
          width: '100%'
        },
        placeholder: t('menus.pidLabelMessage'),
        clearable: true,
        // options: [],
        props: {
          expandTrigger: 'hover',
          checkStrictly: true,
          emitPath: false
        },
        modelValue: 0
      }
      //value: 2
    },
    detail: {
      span: 24
    }
  },
  {
    field: 'sort',
    label: t('menus.sort'),
    form: {
      colProps: {
        span: 8
      },
      component: 'InputNumber',
      componentProps: {
        min: 0
      },
      value: 0
    },
    detail: {
      span: 24
    }
  },
  {
    field: 'component',
    width: '260px',
    label: t('menus.component'),
    search: {
      show: false
    },
    form: {
      colProps: {
        span: 16
      },
      labelMessage: t('menus.componentLabelMessage'),
      componentProps: {
        placeholder: t('menus.componentLabelMessage')
      }
    },
    detail: {
      span: 24
    }
  },
  // {
  //   field: 'type',
  //   label: t('menus.type'),
  //   form: {
  //     colProps: {
  //       span: 8
  //     },
  //     component: 'Select',
  //     componentProps: {
  //       style: {
  //         width: '100%'
  //       },
  //       options: [
  //         {
  //           label: '是',
  //           value: 1
  //         },
  //         {
  //           label: '否',
  //           value: 0
  //         }
  //       ]
  //     },
  //     value: 0
  //   },
  //   detail: {
  //     span: 24
  //   }
  // },

  {
    field: 'is_root',
    label: t('menus.is_root'),
    width: '110px',
    search: {
      show: false
    },
    form: {
      colProps: {
        span: 8
      },
      labelMessage: t('menus.isRootLabelMessage'),
      component: 'Select',
      componentProps: {
        style: {
          width: '100%'
        },
        options: [
          {
            label: '是',
            value: 1
          },
          {
            label: '否',
            value: 0
          }
        ]
      },
      value: 0
    },
    detail: {
      span: 24
    },
    formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
      return h(
        ElTag,
        {
          type: cellValue == 0 ? 'warning' : 'success'
        },
        () => (cellValue == 0 ? '否' : '是')
      )
    }
  },
  {
    field: 'is_cache',
    label: t('menus.is_cache'),
    search: {
      show: false
    },
    form: {
      colProps: {
        span: 8
      },
      component: 'Select',
      labelMessage: t('menus.isCacheLabelMessage'),
      componentProps: {
        style: {
          width: '100%'
        },
        options: [
          {
            label: '是',
            value: 1
          },
          {
            label: '否',
            value: 0
          }
        ]
      },
      value: 0
    },
    detail: {
      span: 24
    },
    formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
      return h(
        ElTag,
        {
          type: cellValue == 0 ? 'warning' : 'success'
        },
        () => (cellValue == 0 ? '否' : '是')
      )
    }
  },
  {
    field: 'redirect',
    label: t('menus.redirect'),
    width: '120px',
    form: {
      show: true,
      labelMessage: t('menus.redirectLabelMessage'),
      colProps: {
        span: 8
      }
    }
  },
  {
    field: 'action',
    width: '300px',
    fixed: 'right',
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

const AddAction = (row: MenuInfo | null, type: string) => {
  if (type == 'addsub' && row) {
    const tempRow = row
    tempRow.active_menu = ''
    tempRow.component = ''
    tempRow.display_name = ''
    tempRow.follow_auth = ''
    tempRow.icon = ''
    tempRow.is_cache = 0
    tempRow.is_hidden = 0
    tempRow.can_to = 0
    tempRow.is_root = 0
    tempRow.name = ''
    tempRow.path = ''
    tempRow.pid = tempRow.id
    tempRow.redirect = ''
    tempRow.sort = 0
    tempRow.type = 0
    tempRow.uri = ''
    tableObject.currentRow = tempRow
    actionType.value = 'addsub'
  } else if (type == 'copy') {
    tableObject.currentRow = row
    actionType.value = 'copy'
  } else {
    actionType.value = 'add'
    tableObject.currentRow = null
  }

  dialogVisible.value = true
  dialogTitle.value = t(type == 'add' ? 'menus.add' : 'menus.addsub')
}

const delLoading = ref(false)

const delData = async (row: MenuInfo | null, multiple: boolean) => {
  tableObject.currentRow = row
  console.log('delData :>> ', row)
  const { delList, getSelections } = methods
  const selections = await getSelections()
  delLoading.value = true

  await delList(
    multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as number],
    multiple,
    true,
    () => {
      updateRouter()
    }
  )
    .then((res) => {
      console.log('res', res)
    })
    .finally(() => {
      delLoading.value = false
    })
}

const actionType = ref('')

const action = (row: MenuInfo, type: string) => {
  dialogTitle.value = t(type === 'edit' ? 'menus.edit' : 'menus.addsub')
  actionType.value = type
  tableObject.currentRow = row
  dialogVisible.value = true
}

const writeRef = ref<ComponentRef<typeof Write>>()

const loading = ref(false)

const save = async () => {
  const write = unref(writeRef)
  await write?.elFormRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      const data = (await write?.getFormData()) as MenuInfo
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
            getList().then((_) => {
              console.log('edit success')
              updateRouter()
            })
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
            getList().then((_) => {
              console.log('add success')
              updateRouter()
            })
          }
          break
      }
    }
  })
}

const updateRouter = async () => {
  console.log('call updateRouter functional ==>')
  const { data } = await getRoelMenusApi()
  wsCache.set('roleRouters', data)
  await permissionStore.generateRoutes('admin', data as AppCustomRouteRecordRaw[])
  window.location.reload()
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
      <ElButton type="primary" @click="AddAction(null, 'add')">{{ t('menus.add') }}</ElButton>
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
      row-key="id"
      :pagination="{
        total: tableObject.total
      }"
      @register="register"
    >
      <template #action="{ row }">
        <ElButton type="primary" text size="small" @click="action(row, 'edit')">
          {{ t('exampleDemo.edit') }}
        </ElButton>
        <ElButton type="success" text size="small" @click="AddAction(row, 'addsub')">
          {{ t('menus.addsub') }}
        </ElButton>
        <ElButton type="warning" text size="small" @click="AddAction(row, 'copy')">
          {{ t('menus.copy') }}
        </ElButton>
        <ElButton type="danger" text size="small" @click="delData(row, false)">
          {{ t('exampleDemo.del') }}
        </ElButton>
      </template>
    </Table>
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <Write
      v-if="actionType !== 'detail'"
      ref="writeRef"
      :action-type="actionType"
      :form-schema="allSchemas.formSchema"
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
