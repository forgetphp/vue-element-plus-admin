import type { Component } from 'vue'
import {
  ElCascader,
  ElCheckboxGroup,
  ElColorPicker,
  ElDatePicker,
  ElInput,
  ElInputNumber,
  ElRadioGroup,
  ElRate,
  ElSelect,
  ElSelectV2,
  ElSlider,
  ElSwitch,
  ElTimePicker,
  ElTimeSelect,
  ElTransfer,
  ElAutocomplete,
  ElDivider,
  ElTreeSelect
} from 'element-plus'
import { InputPassword } from '@/components/InputPassword'
import { Editor } from '@/components/Editor'
import { ComponentName } from '@/types/components'
import { InputCaptcha } from '@/components/InputCaptcha'
import { SMUpload, SMUploadSingle } from '@/components/Upload'

const componentMap: Recordable<Component, ComponentName> = {
  Radio: ElRadioGroup,
  Checkbox: ElCheckboxGroup,
  CheckboxButton: ElCheckboxGroup,
  Input: ElInput,
  Autocomplete: ElAutocomplete,
  InputNumber: ElInputNumber,
  Select: ElSelect,
  Cascader: ElCascader,
  Switch: ElSwitch,
  Slider: ElSlider,
  TimePicker: ElTimePicker,
  DatePicker: ElDatePicker,
  Rate: ElRate,
  ColorPicker: ElColorPicker,
  Transfer: ElTransfer,
  Divider: ElDivider,
  TimeSelect: ElTimeSelect,
  SelectV2: ElSelectV2,
  RadioButton: ElRadioGroup,
  InputPassword: InputPassword,
  Editor: Editor,
  InputCaptcha: InputCaptcha,
  SMUpload: SMUpload,
  SMUploadSingle: SMUploadSingle,
  TreeSelect: ElTreeSelect
}

export { componentMap }
