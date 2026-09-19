<template>
  <div class="cases-page">
    <!-- Hero -->
    <section class="page-hero">
      <div class="hero-content">
        <span class="hero-badge">服务案例</span>
        <h1>成功<span class="gradient-text">案例展示</span></h1>
        <p>汇聚各行业优质项目成果，见证我们的专业实力</p>
      </div>
    </section>

    <!-- 数据统计 -->
    <section class="stats-section">
      <div class="stats-container">
        <div v-for="stat in stats" :key="stat.label" class="stat-card">
          <div class="stat-icon">{{ stat.icon }}</div>
          <div class="stat-info">
            <span class="stat-num">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 行业筛选 -->
    <section class="industry-section">
      <div class="industry-container">
        <button
          v-for="ind in industries"
          :key="ind.value"
          class="industry-btn"
          :class="{ active: activeIndustry === ind.value }"
          @click="handleIndustryChange(ind.value)"
        >
          <span class="ind-icon">{{ ind.icon }}</span>
          <span>{{ ind.label }}</span>
          <span class="ind-count">{{ ind.count }}</span>
        </button>
      </div>
    </section>

    <!-- 案例列表 -->
    <section class="cases-section">
      <div class="cases-container">
        <div class="section-header">
          <span class="section-header__badge">
            <el-icon><Trophy /></el-icon> 精选案例
          </span>
          <h2 class="section-header__title">
            {{ activeIndustry ? getIndustryLabel(activeIndustry) + '案例' : '全部案例' }}
          </h2>
          <p class="section-header__desc">探索我们为客户创造的价值</p>
        </div>

        <div v-loading="loading" class="cases-grid">
          <div
            v-for="caseItem in filteredCases"
            :key="caseItem.id"
            class="case-card"
            @click="showCaseDetail(caseItem)"
          >
            <div class="case-image">
              <img :src="caseItem.coverImage" :alt="caseItem.title" />
              <div class="case-overlay">
                <el-button type="primary" round size="small">
                  查看详情 <el-icon><Right /></el-icon>
                </el-button>
              </div>
              <div class="case-industry">{{ caseItem.industry }}</div>
            </div>
            <div class="case-content">
              <div class="case-meta">
                <span class="case-client">
                  <el-icon><OfficeBuilding /></el-icon>
                  {{ caseItem.client }}
                </span>
                <span class="case-meta-right">
                  <span class="case-comments">
                    <el-icon><ChatDotRound /></el-icon>
                    {{ commentsStore.countOf('case', caseItem.id) }} 条评论
                  </span>
                  <span class="case-date">
                    <el-icon><Calendar /></el-icon>
                    {{ caseItem.publishTime }}
                  </span>
                </span>
              </div>
              <h3 class="case-title">{{ caseItem.title }}</h3>
              <p class="case-desc">{{ caseItem.description }}</p>
              <div class="case-tags">
                <span v-for="tag in caseItem.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
              <div class="case-results">
                <div v-for="result in caseItem.results.slice(0, 2)" :key="result.label" class="result-item">
                  <span class="result-value">{{ result.value }}</span>
                  <span class="result-label">{{ result.label }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <el-empty v-if="!loading && filteredCases.length === 0" description="暂无相关案例" />
      </div>
    </section>

    <!-- 预约咨询 -->
    <section class="consult-section">
      <div class="consult-container">
        <div class="consult-visual">
          <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=700&fit=crop" alt="咨询服务" class="visual-bg" />
          <div class="visual-overlay"></div>
          <div class="visual-content">
            <span class="visual-badge">免费咨询</span>
            <h2>获取专属解决方案</h2>
            <p>告诉我们您的需求，我们的专业团队将为您量身定制同类方案</p>
            <div class="visual-features">
              <div class="v-feature">
                <el-icon><Check /></el-icon>
                <span>1对1专业顾问服务</span>
              </div>
              <div class="v-feature">
                <el-icon><Check /></el-icon>
                <span>免费提供方案报价</span>
              </div>
              <div class="v-feature">
                <el-icon><Check /></el-icon>
                <span>24小时内快速响应</span>
              </div>
              <div class="v-feature">
                <el-icon><Check /></el-icon>
                <span>成功案例参考借鉴</span>
              </div>
            </div>
          </div>
        </div>

        <div class="consult-form">
          <div class="form-header">
            <h3>预约方案咨询</h3>
            <p v-if="selectedCase" class="selected-case-hint">
              已选择案例：<span>{{ selectedCase.title }}</span>
            </p>
            <p v-else>填写以下信息，我们将尽快与您联系</p>
          </div>

          <el-form
            ref="formRef"
            :model="formData"
            :rules="formRules"
            label-position="top"
            size="large"
          >
            <el-row :gutter="16">
              <el-col :span="12">
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="formData.name" placeholder="您的姓名" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="电话" prop="phone">
                  <el-input v-model="formData.phone" placeholder="您的电话" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="16">
              <el-col :span="12">
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="formData.email" placeholder="您的邮箱" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="公司名称">
                  <el-input v-model="formData.company" placeholder="公司名称（选填）" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="所属行业" prop="industry">
              <el-select v-model="formData.industry" placeholder="请选择所属行业" style="width: 100%">
                <el-option
                  v-for="ind in industries.filter(i => i.value)"
                  :key="ind.value"
                  :label="ind.label"
                  :value="ind.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="需求描述" prop="requirement">
              <el-input
                v-model="formData.requirement"
                type="textarea"
                :rows="4"
                placeholder="请描述您的需求，我们将为您提供同类方案参考..."
              />
            </el-form-item>

            <el-form-item class="submit-item">
              <el-button
                type="primary"
                class="submit-btn"
                :loading="submitting"
                @click="handleSubmit"
              >
                {{ submitting ? '提交中...' : '立即预约咨询' }}
                <el-icon v-if="!submitting"><Right /></el-icon>
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </section>

    <!-- 案例详情弹窗 -->
    <el-dialog
      v-model="detailVisible"
      :title="currentCase?.title"
      width="900px"
      class="case-detail-dialog"
      destroy-on-close
    >
      <div v-if="currentCase" class="detail-content">
        <div class="detail-image">
          <img :src="currentCase.coverImage" :alt="currentCase.title" />
          <div class="detail-badges">
            <span class="detail-badge">{{ currentCase.industry }}</span>
            <span class="detail-badge">{{ currentCase.serviceType }}</span>
          </div>
        </div>

        <div class="detail-info">
          <div class="detail-meta">
            <span class="meta-item">
              <el-icon><OfficeBuilding /></el-icon>
              客户：{{ currentCase.client }}
            </span>
            <span class="meta-item">
              <el-icon><Calendar /></el-icon>
              时间：{{ currentCase.publishTime }}
            </span>
          </div>

          <div class="detail-tags">
            <span v-for="tag in currentCase.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>

          <p class="detail-desc">{{ currentCase.description }}</p>

          <div class="detail-section">
            <h4>
              <el-icon><Star /></el-icon>
              项目亮点
            </h4>
            <ul class="highlights-list">
              <li v-for="(item, index) in currentCase.highlights" :key="index">
                <span class="highlight-num">{{ index + 1 }}</span>
                {{ item }}
              </li>
            </ul>
          </div>

          <div class="detail-section">
            <h4>
              <el-icon><DataAnalysis /></el-icon>
              项目成果
            </h4>
            <div class="results-grid">
              <div v-for="result in currentCase.results" :key="result.label" class="result-card">
                <span class="result-value">{{ result.value }}</span>
                <span class="result-label">{{ result.label }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 评论互动 -->
        <div class="detail-comments">
          <CommentSection target-type="case" :target-id="currentCase.id" />
        </div>
      </div>

      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleConsultThisCase">
          预约同类方案咨询
          <el-icon><ChatDotRound /></el-icon>
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import type { CaseItem, ConsultationForm } from '@/types'
import CommentSection from '@/components/common/CommentSection.vue'
import { useCommentsStore } from '@/stores/comments'

const commentsStore = useCommentsStore()

const loading = ref(false)
const detailVisible = ref(false)
const submitting = ref(false)
const formRef = ref<FormInstance>()
const activeIndustry = ref('')
const currentCase = ref<CaseItem | null>(null)
const selectedCase = ref<CaseItem | null>(null)

const industries = [
  { label: '全部行业', value: '', icon: '🏢', count: 24 },
  { label: '金融科技', value: '金融科技', icon: '💰', count: 6 },
  { label: '电商零售', value: '电商零售', icon: '🛒', count: 5 },
  { label: '教育培训', value: '教育培训', icon: '📚', count: 4 },
  { label: '医疗健康', value: '医疗健康', icon: '🏥', count: 3 },
  { label: '智能制造', value: '智能制造', icon: '🏭', count: 3 },
  { label: '文化传媒', value: '文化传媒', icon: '🎬', count: 3 }
]

const stats = [
  { icon: '🏆', value: '200+', label: '成功案例' },
  { icon: '👥', value: '500+', label: '服务客户' },
  { icon: '⭐', value: '98%', label: '客户满意度' },
  { icon: '📈', value: '10年', label: '行业经验' }
]

const cases = ref<CaseItem[]>([
  {
    id: 1,
    title: '某大型银行数字化转型平台',
    description: '为某国有大型银行打造全渠道数字化服务平台，实现业务线上化、智能化升级。',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
    industry: '金融科技',
    client: '某国有银行',
    serviceType: '平台开发',
    tags: ['金融科技', '数字化转型', '微服务'],
    highlights: [
      '采用微服务架构，支持亿级用户并发访问',
      '实现99.99%系统可用性，年 downtime 小于5分钟',
      '智能化风控系统，识别准确率达99.7%',
      '全渠道统一用户体验，支持PC、APP、小程序'
    ],
    results: [
      { label: '用户转化率提升', value: '+150%' },
      { label: '运营成本降低', value: '-40%' },
      { label: '客户满意度', value: '96%' },
      { label: '交易处理效率', value: '+200%' }
    ],
    publishTime: '2024-03'
  },
  {
    id: 2,
    title: '跨境电商独立站建设',
    description: '为某知名跨境电商品牌打造独立站平台，实现品牌出海战略目标。',
    coverImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
    industry: '电商零售',
    client: '某跨境电商公司',
    serviceType: '电商平台',
    tags: ['跨境电商', '独立站', '海外营销'],
    highlights: [
      '支持多语言、多货币、多税费体系',
      '集成全球主流支付方式，支付成功率98%',
      '智能物流追踪系统，覆盖200+国家',
      'SEO优化+营销自动化，获客成本降低35%'
    ],
    results: [
      { label: '月均订单量', value: '10万+' },
      { label: '复购率提升', value: '+85%' },
      { label: '客单价提升', value: '+60%' },
      { label: '退款率降低', value: '-50%' }
    ],
    publishTime: '2024-02'
  },
  {
    id: 3,
    title: '在线教育学习平台',
    description: '为某教育集团打造综合性在线学习平台，支持直播授课、录播课程、互动问答等功能。',
    coverImage: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&h=400&fit=crop',
    industry: '教育培训',
    client: '某教育科技公司',
    serviceType: '教育平台',
    tags: ['在线教育', '直播课堂', 'AI教育'],
    highlights: [
      '支持万人同时在线直播，延迟小于1秒',
      'AI智能题库，个性化学习路径推荐',
      '学习数据分析系统，助力教学效果提升',
      '多端同步学习，支持离线缓存'
    ],
    results: [
      { label: '注册学员', value: '50万+' },
      { label: '完课率提升', value: '+200%' },
      { label: '平均学习时长', value: '45分钟/天' },
      { label: '课程好评率', value: '97%' }
    ],
    publishTime: '2024-01'
  },
  {
    id: 4,
    title: '智慧医疗预约挂号系统',
    description: '为某三甲医院打造智慧医疗服务平台，实现线上预约、智能分诊、远程问诊等功能。',
    coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop',
    industry: '医疗健康',
    client: '某三甲医院',
    serviceType: '医疗系统',
    tags: ['智慧医疗', '预约挂号', '远程问诊'],
    highlights: [
      '智能分诊系统，分诊准确率95%+',
      '支持多渠道预约，号源实时同步',
      '电子处方流转，药品配送到家',
      '医患沟通平台，提升就医体验'
    ],
    results: [
      { label: '患者等待时间', value: '-70%' },
      { label: '预约成功率', value: '99%' },
      { label: '医生工作效率', value: '+50%' },
      { label: '患者满意度', value: '95%' }
    ],
    publishTime: '2023-12'
  },
  {
    id: 5,
    title: '工业物联网平台',
    description: '为某制造企业打造工业物联网平台，实现设备远程监控、预测性维护、智能排产等功能。',
    coverImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop',
    industry: '智能制造',
    client: '某制造企业',
    serviceType: '物联网平台',
    tags: ['工业4.0', '物联网', '智能制造'],
    highlights: [
      '接入5000+生产设备，实时数据采集',
      'AI预测性维护，设备故障预警提前72小时',
      '智能排产系统，生产效率提升30%',
      '数字孪生技术，实现生产全过程可视化'
    ],
    results: [
      { label: '设备故障率', value: '-60%' },
      { label: '生产效率', value: '+35%' },
      { label: '运维成本', value: '-45%' },
      { label: '能源利用率', value: '+25%' }
    ],
    publishTime: '2023-11'
  },
  {
    id: 6,
    title: '短视频内容创作平台',
    description: '为某传媒公司打造短视频内容创作与分发平台，支持AI辅助创作、智能剪辑、多平台分发。',
    coverImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop',
    industry: '文化传媒',
    client: '某传媒集团',
    serviceType: '内容平台',
    tags: ['短视频', 'AI创作', '内容分发'],
    highlights: [
      'AI智能脚本生成，创作效率提升3倍',
      '智能剪辑系统，自动生成精彩片段',
      '一键分发10+主流平台，运营效率翻倍',
      '内容数据分析，指导创作方向优化'
    ],
    results: [
      { label: '内容产出效率', value: '+300%' },
      { label: '爆款率提升', value: '+150%' },
      { label: '运营人力', value: '-60%' },
      { label: '粉丝增长', value: '500万+' }
    ],
    publishTime: '2023-10'
  },
  {
    id: 7,
    title: '保险智能理赔系统',
    description: '为某保险公司打造智能理赔系统，通过AI技术实现理赔自动化、智能化处理。',
    coverImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop',
    industry: '金融科技',
    client: '某保险公司',
    serviceType: '智能系统',
    tags: ['保险科技', 'AI理赔', '风控'],
    highlights: [
      'OCR+NLP智能识别理赔材料，准确率99%',
      'AI自动定损，秒级生成理赔方案',
      '智能风控模型，欺诈识别率98%',
      '小额案件自动赔付，到账时间小于5分钟'
    ],
    results: [
      { label: '理赔时效', value: '-80%' },
      { label: '人力成本', value: '-70%' },
      { label: '客户满意度', value: '94%' },
      { label: '欺诈损失', value: '-65%' }
    ],
    publishTime: '2023-09'
  },
  {
    id: 8,
    title: '生鲜电商供应链系统',
    description: '为某生鲜电商企业打造全链路供应链管理系统，实现采购、仓储、配送全流程数字化。',
    coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop',
    industry: '电商零售',
    client: '某生鲜电商公司',
    serviceType: '供应链系统',
    tags: ['生鲜电商', '供应链', '智能仓储'],
    highlights: [
      '智能需求预测，库存周转提升50%',
      'WMS智能仓储系统，支持多温区管理',
      'TMS运输管理系统，全程冷链监控',
      '溯源系统，商品全链路可追溯'
    ],
    results: [
      { label: '库存周转率', value: '+50%' },
      { label: '损耗率', value: '-40%' },
      { label: '配送准时率', value: '98.5%' },
      { label: '供应链成本', value: '-25%' }
    ],
    publishTime: '2023-08'
  },
  {
    id: 9,
    title: '职业技能培训平台',
    description: '为某职业教育机构打造在线职业技能培训平台，提供技能测评、课程学习、认证考试一体化服务。',
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop',
    industry: '教育培训',
    client: '某职业教育机构',
    serviceType: '培训平台',
    tags: ['职业教育', '技能认证', '在线考试'],
    highlights: [
      'AI技能测评系统，精准定位能力短板',
      '实战项目驱动教学，边学边练',
      '在线考试系统，防作弊机制完善',
      '学习路径规划，阶段性成长可见'
    ],
    results: [
      { label: '认证通过率', value: '89%' },
      { label: '学员就业率', value: '92%' },
      { label: '平均薪资涨幅', value: '+45%' },
      { label: '学员好评率', value: '96%' }
    ],
    publishTime: '2023-07'
  }
])

const filteredCases = computed(() => {
  if (!activeIndustry.value) return cases.value
  return cases.value.filter(c => c.industry === activeIndustry.value)
})

const formData = reactive<ConsultationForm>({
  name: '',
  email: '',
  phone: '',
  company: '',
  industry: '',
  caseId: undefined,
  caseTitle: '',
  requirement: ''
})

const formRules: FormRules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  industry: [
    { required: true, message: '请选择所属行业', trigger: 'change' }
  ],
  requirement: [
    { required: true, message: '请输入需求描述', trigger: 'blur' },
    { min: 10, max: 500, message: '内容在 10 到 500 个字符', trigger: 'blur' }
  ]
}

const getIndustryLabel = (value: string) => {
  const ind = industries.find(i => i.value === value)
  return ind ? ind.label : ''
}

const handleIndustryChange = (value: string) => {
  activeIndustry.value = value
}

const showCaseDetail = (caseItem: CaseItem) => {
  currentCase.value = caseItem
  detailVisible.value = true
}

const handleConsultThisCase = () => {
  if (currentCase.value) {
    selectedCase.value = currentCase.value
    formData.caseId = currentCase.value.id
    formData.caseTitle = currentCase.value.title
    formData.industry = currentCase.value.industry
    formData.requirement = `我对"${currentCase.value.title}"案例很感兴趣，希望咨询同类方案。`
  }
  detailVisible.value = false
  document.querySelector('.consult-section')?.scrollIntoView({ behavior: 'smooth' })
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        ElMessage.success('预约成功！我们的顾问将在24小时内与您联系')
        formRef.value?.resetFields()
        selectedCase.value = null
        formData.caseId = undefined
        formData.caseTitle = ''
      } catch {
        ElMessage.error('提交失败，请稍后重试')
      } finally {
        submitting.value = false
      }
    }
  })
}

onMounted(() => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>

<style lang="scss" scoped>
.cases-page {
  padding-top: $header-height;
}

// ==================== Hero ====================
.page-hero {
  padding: $spacing-4xl $spacing-lg;
  background: $gradient-hero;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -10%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -50%;
    right: -10%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%);
    border-radius: 50%;
  }

  .hero-content {
    position: relative;
    z-index: 1;
  }

  .hero-badge {
    display: inline-block;
    padding: $spacing-sm $spacing-md;
    background: rgba($primary-color, 0.2);
    color: $primary-color-light;
    font-size: $font-size-sm;
    font-weight: 600;
    border-radius: $border-radius-full;
    margin-bottom: $spacing-md;
  }

  h1 {
    font-size: clamp(36px, 6vw, $font-size-5xl);
    color: white;
    margin-bottom: $spacing-md;

    .gradient-text {
      background: $gradient-text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  p {
    font-size: $font-size-lg;
    color: rgba(255, 255, 255, 0.7);
  }
}

// ==================== 数据统计 ====================
.stats-section {
  padding: 0 $spacing-lg;
  margin-top: -$spacing-xxl;
  position: relative;
  z-index: 10;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-lg;
  max-width: $container-max-width;
  margin: 0 auto;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-xl;
  background: white;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-xl;
  transition: all $transition-normal;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-2xl;
  }

  .stat-icon {
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $gradient-primary;
    border-radius: $border-radius-md;
    font-size: 28px;
  }

  .stat-info {
    display: flex;
    flex-direction: column;

    .stat-num {
      font-size: $font-size-xxl;
      font-weight: 700;
      background: $gradient-text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1.2;
    }

    .stat-label {
      font-size: $font-size-sm;
      color: $text-color-secondary;
    }
  }
}

// ==================== 行业筛选 ====================
.industry-section {
  padding: $spacing-3xl $spacing-lg $spacing-xl;
  background: white;
}

.industry-container {
  display: flex;
  justify-content: flex-start;
  gap: $spacing-sm;
  max-width: $container-max-width;
  margin: 0 auto;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: $breakpoint-lg) {
    justify-content: center;
    flex-wrap: wrap;
  }
}

.industry-btn {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-sm $spacing-lg;
  font-size: $font-size-sm;
  font-weight: 500;
  color: $text-color-secondary;
  background: $bg-color-light;
  border-radius: $border-radius-full;
  white-space: nowrap;
  transition: all $transition-fast;
  flex-shrink: 0;

  .ind-icon {
    font-size: $font-size-md;
  }

  .ind-count {
    padding: 2px 8px;
    background: rgba(0, 0, 0, 0.05);
    border-radius: $border-radius-full;
    font-size: $font-size-xs;
  }

  &:hover {
    color: $text-color-primary;
    background: $border-color;
  }

  &.active {
    color: white;
    background: $gradient-primary;

    .ind-count {
      background: rgba(255, 255, 255, 0.2);
    }
  }
}

// ==================== 案例列表 ====================
.cases-section {
  padding: $spacing-4xl $spacing-lg;
  background: $bg-color-light;
}

.cases-container {
  max-width: $container-max-width;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: $spacing-3xl;

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: $spacing-xs;
    padding: $spacing-sm $spacing-md;
    background: rgba($primary-color, 0.1);
    color: $primary-color;
    font-size: $font-size-sm;
    font-weight: 600;
    border-radius: $border-radius-full;
    margin-bottom: $spacing-md;

    .el-icon {
      font-size: 16px;
    }
  }

  &__title {
    font-size: clamp(28px, 4vw, $font-size-3xl);
    font-weight: 700;
    margin-bottom: $spacing-sm;
  }

  &__desc {
    font-size: $font-size-md;
    color: $text-color-secondary;
  }
}

.cases-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-xl;
}

.case-card {
  background: white;
  border-radius: $border-radius-xl;
  overflow: hidden;
  cursor: pointer;
  transition: all $transition-normal;
  border: 1px solid $border-color-light;

  &:hover {
    border-color: transparent;
    box-shadow: $shadow-2xl;
    transform: translateY(-8px);

    .case-image {
      .case-overlay {
        opacity: 1;
      }

      img {
        transform: scale(1.05);
      }
    }
  }

  .case-image {
    position: relative;
    height: 220px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform $transition-slow;
    }

    .case-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity $transition-normal;
    }

    .case-industry {
      position: absolute;
      top: $spacing-md;
      left: $spacing-md;
      padding: $spacing-xs $spacing-md;
      background: $gradient-primary;
      color: white;
      font-size: $font-size-xs;
      font-weight: 600;
      border-radius: $border-radius-full;
    }
  }

  .case-content {
    padding: $spacing-xl;

    .case-meta {
      display: flex;
      justify-content: space-between;
      margin-bottom: $spacing-md;

      .case-client,
      .case-date {
        display: flex;
        align-items: center;
        gap: $spacing-xs;
        font-size: $font-size-xs;
        color: $text-color-secondary;

        .el-icon {
          font-size: 12px;
        }
      }

      .case-meta-right {
        display: flex;
        align-items: center;
        gap: $spacing-md;
      }

      .case-comments {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: $font-size-xs;
        font-weight: 500;
        color: $primary-color;

        .el-icon {
          font-size: 12px;
        }
      }
    }

    .case-title {
      font-size: $font-size-xl;
      font-weight: 600;
      margin-bottom: $spacing-sm;
      line-height: 1.4;
    }

    .case-desc {
      font-size: $font-size-sm;
      color: $text-color-secondary;
      line-height: $line-height-loose;
      margin-bottom: $spacing-md;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .case-tags {
      display: flex;
      flex-wrap: wrap;
      gap: $spacing-xs;
      margin-bottom: $spacing-lg;

      .tag {
        padding: 4px 10px;
        background: $bg-color-light;
        color: $text-color-regular;
        font-size: $font-size-xs;
        border-radius: $border-radius-full;
      }
    }

    .case-results {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: $spacing-md;
      padding-top: $spacing-md;
      border-top: 1px dashed $border-color-light;

      .result-item {
        text-align: center;

        .result-value {
          display: block;
          font-size: $font-size-xl;
          font-weight: 700;
          background: $gradient-text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .result-label {
          font-size: $font-size-xs;
          color: $text-color-secondary;
        }
      }
    }
  }
}

// ==================== 预约咨询 ====================
.consult-section {
  padding: $spacing-4xl $spacing-lg;
  background: white;
}

.consult-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: $container-max-width;
  margin: 0 auto;
  border-radius: $border-radius-xl;
  overflow: hidden;
  box-shadow: $shadow-2xl;
}

// 左侧视觉区域
.consult-visual {
  position: relative;
  overflow: hidden;

  .visual-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .visual-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.92) 0%, rgba(139, 92, 246, 0.88) 100%);
  }

  .visual-content {
    position: relative;
    z-index: 1;
    padding: $spacing-3xl;
    height: 100%;
    display: flex;
    flex-direction: column;
    color: white;

    .visual-badge {
      display: inline-block;
      padding: $spacing-sm $spacing-md;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      color: white;
      font-size: $font-size-sm;
      font-weight: 600;
      border-radius: $border-radius-full;
      margin-bottom: $spacing-lg;
      align-self: flex-start;
    }

    h2 {
      font-size: $font-size-3xl;
      font-weight: 700;
      margin-bottom: $spacing-md;
    }

    > p {
      font-size: $font-size-md;
      opacity: 0.9;
      line-height: $line-height-loose;
      margin-bottom: $spacing-xl;
    }
  }
}

.visual-features {
  margin-top: auto;

  .v-feature {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    padding: $spacing-sm 0;
    font-size: $font-size-md;

    .el-icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.2);
      border-radius: $border-radius-round;
      font-size: 14px;
      flex-shrink: 0;
    }
  }
}

// 右侧表单
.consult-form {
  background: white;
  padding: $spacing-3xl;
  display: flex;
  flex-direction: column;

  .form-header {
    margin-bottom: $spacing-xl;

    h3 {
      font-size: $font-size-xxl;
      font-weight: 700;
      margin-bottom: $spacing-xs;
    }

    p {
      font-size: $font-size-md;
      color: $text-color-secondary;
    }

    .selected-case-hint {
      color: $primary-color;
      background: rgba($primary-color, 0.05);
      padding: $spacing-sm $spacing-md;
      border-radius: $border-radius-md;
      margin-top: $spacing-sm;

      span {
        font-weight: 600;
      }
    }
  }

  :deep(.el-form-item__label) {
    font-weight: 600;
    color: $text-color-primary;
    padding-bottom: $spacing-xs;
  }

  :deep(.el-input__wrapper),
  :deep(.el-textarea__inner),
  :deep(.el-select__wrapper) {
    border-radius: $border-radius-md;
    box-shadow: none;
    border: 1px solid $border-color;

    &:hover, &.is-focus {
      border-color: $primary-color;
    }
  }

  :deep(.el-textarea__inner) {
    padding: $spacing-md;
  }

  .submit-item {
    margin-top: $spacing-md;
    margin-bottom: 0;
  }
}

.submit-btn {
  width: 100%;
  height: 52px;
  font-size: $font-size-md;
  font-weight: 600;
  background: $gradient-primary;
  border: none;
  border-radius: $border-radius-md;

  .el-icon {
    margin-left: $spacing-sm;
  }

  &:hover {
    opacity: 0.9;
  }
}

// ==================== 详情弹窗 ====================
.case-detail-dialog {
  :deep(.el-dialog__body) {
    padding: 0;
  }

  .detail-content {
    .detail-image {
      position: relative;
      height: 300px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .detail-badges {
        position: absolute;
        bottom: $spacing-lg;
        left: $spacing-lg;
        display: flex;
        gap: $spacing-sm;

        .detail-badge {
          padding: $spacing-sm $spacing-md;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(10px);
          color: white;
          font-size: $font-size-sm;
          font-weight: 600;
          border-radius: $border-radius-full;
        }
      }
    }

    .detail-info {
      padding: $spacing-xxl;

      .detail-meta {
        display: flex;
        gap: $spacing-xl;
        margin-bottom: $spacing-md;

        .meta-item {
          display: flex;
          align-items: center;
          gap: $spacing-xs;
          font-size: $font-size-sm;
          color: $text-color-secondary;

          .el-icon {
            font-size: 14px;
          }
        }
      }

      .detail-tags {
        display: flex;
        flex-wrap: wrap;
        gap: $spacing-xs;
        margin-bottom: $spacing-lg;

        .tag {
          padding: 4px 10px;
          background: rgba($primary-color, 0.1);
          color: $primary-color;
          font-size: $font-size-xs;
          border-radius: $border-radius-full;
        }
      }

      .detail-desc {
        font-size: $font-size-md;
        color: $text-color-regular;
        line-height: $line-height-loose;
        margin-bottom: $spacing-xl;
      }

      .detail-section {
        margin-bottom: $spacing-xl;

        h4 {
          display: flex;
          align-items: center;
          gap: $spacing-sm;
          font-size: $font-size-lg;
          font-weight: 600;
          margin-bottom: $spacing-md;

          .el-icon {
            color: $primary-color;
          }
        }

        .highlights-list {
          li {
            display: flex;
            gap: $spacing-md;
            padding: $spacing-md 0;
            border-bottom: 1px dashed $border-color-light;

            &:last-child {
              border-bottom: none;
            }

            .highlight-num {
              flex-shrink: 0;
              width: 28px;
              height: 28px;
              display: flex;
              align-items: center;
              justify-content: center;
              background: $gradient-primary;
              color: white;
              font-size: $font-size-sm;
              font-weight: 700;
              border-radius: $border-radius-round;
            }
          }
        }

        .results-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: $spacing-md;

          .result-card {
            text-align: center;
            padding: $spacing-lg;
            background: $bg-color-light;
            border-radius: $border-radius-lg;

            .result-value {
              display: block;
              font-size: $font-size-xxl;
              font-weight: 700;
              background: $gradient-text;
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              margin-bottom: $spacing-xs;
            }

            .result-label {
              font-size: $font-size-sm;
              color: $text-color-secondary;
            }
          }
        }
      }
    }

    .detail-comments {
      padding: 0 $spacing-xxl $spacing-xxl;

      .comment-section {
        background: $bg-color-light;
        box-shadow: none;
        border: 1px solid $border-color-light;
      }
    }
  }
}

// ==================== 响应式 ====================
@media (max-width: $breakpoint-lg) {
  .stats-container {
    grid-template-columns: repeat(2, 1fr);
  }

  .cases-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .consult-container {
    grid-template-columns: 1fr;
  }

  .consult-visual {
    min-height: 300px;

    .visual-content {
      padding: $spacing-xl;
    }
  }

  .case-detail-dialog {
    .detail-content {
      .detail-info {
        .detail-section {
          .results-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      }
    }
  }
}

@media (max-width: $breakpoint-md) {
  .stats-container {
    grid-template-columns: 1fr 1fr;
    gap: $spacing-md;
  }

  .stat-card {
    padding: $spacing-md;

    .stat-icon {
      width: 44px;
      height: 44px;
      font-size: 22px;
    }

    .stat-info {
      .stat-num {
        font-size: $font-size-xl;
      }
    }
  }

  .cases-grid {
    grid-template-columns: 1fr;
  }

  .consult-form {
    padding: $spacing-xl;
  }

  .case-detail-dialog {
    :deep(.el-dialog) {
      width: 95% !important;
    }

    .detail-content {
      .detail-image {
        height: 200px;
      }

      .detail-info {
        padding: $spacing-xl;

        .detail-meta {
          flex-direction: column;
          gap: $spacing-xs;
        }

        .detail-section {
          .results-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      }

      .detail-comments {
        padding: 0 $spacing-xl $spacing-xl;
      }
    }
  }
}
</style>
