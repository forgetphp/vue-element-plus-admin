<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Dialog } from '@/components/Dialog'
import { useI18n } from '@/hooks/web/useI18n'
import {
  ElButton,
  ElDrawer,
  ElInput,
  ElMessage,
  ElSwitch,
  ElTabPane,
  ElTabs,
  ElTree
} from 'element-plus'
import { Table } from '@/components/Table'
import {
  getTableListApi,
  saveTableApi,
  delTableListApi,
  disableApi,
  updateTableApi,
  putRoleMenuApi
} from '@/api/role'
import { useTable } from '@/hooks/web/useTable'
import { AdminInfo } from '@/api/admin/type'
import { h, ref, unref, reactive, watch } from 'vue'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
import { getRoelMenusApi } from '@/api/login'
import { RoleInfo } from '@/api/role/types'

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
    label: t('role.id'),
    form: {
      show: false
    },
    detail: {
      show: false
    }
  },
  {
    field: 'name',
    label: t('role.name'),
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
    field: 'display_name',
    label: t('role.display_name'),
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
            disableApi(record.id, { state: cellValue == 0 ? 1 : 0 })
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
    field: 'description',
    label: t('role.description'),
    search: {
      show: false
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
  {
    field: 'action',
    width: '360px',
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

const AddAction = () => {
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

const drawerVisable = ref(false)
interface Tree {
  id: number
  display_name: string
  children?: Tree[]
}
interface MenuRole {
  menu_id: number
  role_id: number
}
const tempMenuIds = ref([])
const treeData = ref<Tree[]>([])
const currentTabs = ref('menus')
const filterText = ref('')
const treeRef = ref<InstanceType<typeof ElTree>>()
const defaultProps = {
  children: 'children',
  label: 'display_name'
}
const currentTempRole = ref<RoleInfo>()
const openDrawer = (row: RoleInfo) => {
  currentTempRole.value = row
  drawerVisable.value = true
}
const closeDrawer = async () => {
  drawerVisable.value = false
  const keys = treeRef.value!.getCheckedKeys(false)
  const res = await putRoleMenuApi(currentTempRole.value?.id, keys)
  console.log('select keys ==> ', keys, res)
  getList()
}

const onOpenDrawer = async () => {
  const { data } = await getRoelMenusApi()
  tempMenuIds.value = currentTempRole.value?.menus.map((element: MenuRole) => {
    return element.menu_id
  })
  treeRef.value!.setCheckedKeys(tempMenuIds.value, false)
  treeData.value = data
}

const filterNode = (value: string, data: Tree) => {
  if (!value) return true
  return data.display_name.includes(value)
}
watch(filterText, (val) => {
  treeRef.value!.filter(val)
})
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
        <ElButton type="primary" size="small" @click="openDrawer(row)">
          {{ t('role.addPermission') }}
        </ElButton>
        <ElButton type="primary" size="small" @click="action(row, 'edit')">
          {{ t('exampleDemo.edit') }}
        </ElButton>
        <ElButton type="success" size="small" @click="action(row, 'detail')">
          {{ t('exampleDemo.detail') }}
        </ElButton>
        <ElButton type="danger" size="small" @click="delData(row, false)">
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

  <ElDrawer
    v-model="drawerVisable"
    direction="rtl"
    :with-header="false"
    @open="onOpenDrawer"
    size="50%"
  >
    <ElTabs v-model="currentTabs" type="card">
      <ElTabPane :label="t('role.menus')" name="menus">
        <ElInput v-model="filterText" :placeholder="t('role.menusFilterText')" />
        <ElTree
          ref="treeRef"
          :data="treeData"
          show-checkbox
          default-expand-all
          node-key="id"
          highlight-current
          :props="defaultProps"
          :filter-node-method="filterNode"
        />
      </ElTabPane>
    </ElTabs>
    <template #footer>
      <div style="flex: auto">
        <ElButton @click="drawerVisable = false">{{ t('common.cancel') }}</ElButton>
        <ElButton type="primary" @click="closeDrawer">{{ t('common.ok') }}</ElButton>
      </div>
    </template>
  </ElDrawer>
</template>
