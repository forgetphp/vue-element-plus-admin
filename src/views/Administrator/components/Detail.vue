<script setup lang="ts">
import { PropType } from 'vue'
import type { AdminInfo } from '@/api/admin/type'
import { Descriptions } from '@/components/Descriptions'
import { useI18n } from '@/hooks/web/useI18n'
import { ElImage, ElTag } from 'element-plus'
import { DescriptionsSchema } from '@/types/descriptions'

const { t } = useI18n()

defineProps({
  currentRow: {
    type: Object as PropType<Nullable<AdminInfo>>,
    default: () => null
  },
  detailSchema: {
    type: Array as PropType<DescriptionsSchema[]>,
    default: () => []
  }
})
</script>

<template>
  <Descriptions :schema="detailSchema" :data="currentRow || {}">
    <template #state="{ row }: { row: AdminInfo }">
      <ElTag :type="row.state === 0 ? 'success' : row.state === 2 ? 'warning' : 'danger'">
        {{ row.state === 0 ? t('adminstrator.state_yes') : t('adminstrator.disable') }}
      </ElTag>
    </template>

    <template #avatar="{ row }: { row: AdminInfo }">
      <ElImage :src="row.avatar" :preview-src-list="[row.avatar]" :lazy="true" />
    </template>
  </Descriptions>
</template>
