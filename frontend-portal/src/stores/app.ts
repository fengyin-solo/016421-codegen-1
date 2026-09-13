import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const loading = ref(false)
  const siteTitle = ref('门户网站')
  const siteDescription = ref('专业的企业门户网站解决方案')

  const setLoading = (value: boolean) => {
    loading.value = value
  }

  const setSiteInfo = (title: string, description?: string) => {
    siteTitle.value = title
    if (description) {
      siteDescription.value = description
    }
  }

  return {
    loading,
    siteTitle,
    siteDescription,
    setLoading,
    setSiteInfo
  }
})
