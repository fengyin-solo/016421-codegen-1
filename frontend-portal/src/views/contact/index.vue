<template>
  <div class="contact-page">
    <!-- Hero -->
    <section class="page-hero">
      <div class="hero-content">
        <span class="hero-badge">联系我们</span>
        <h1>让我们开始对话</h1>
        <p>无论您有任何问题或需求，我们都期待与您交流</p>
      </div>
    </section>

    <!-- 联系方式卡片 -->
    <section class="contact-cards-section">
      <div class="cards-container">
        <div class="contact-card">
          <div class="card-icon">
            <span class="icon-emoji">📞</span>
          </div>
          <h3>电话咨询</h3>
          <p>工作日 9:00-18:00</p>
          <a href="tel:400-888-8888" class="card-link">400-888-8888</a>
        </div>
        
        <div class="contact-card">
          <div class="card-icon">
            <span class="icon-emoji">✉️</span>
          </div>
          <h3>邮件联系</h3>
          <p>24小时内回复</p>
          <a href="mailto:hello@portal.com" class="card-link">hello@portal.com</a>
        </div>
        
        <div class="contact-card">
          <div class="card-icon">
            <span class="icon-emoji">📍</span>
          </div>
          <h3>公司地址</h3>
          <p>欢迎来访</p>
          <span class="card-link">北京市朝阳区科技园区</span>
        </div>
        
        <div class="contact-card">
          <div class="card-icon">
            <span class="icon-emoji">💬</span>
          </div>
          <h3>在线客服</h3>
          <p>即时响应</p>
          <a class="card-link" @click="handleNotImplemented">立即咨询</a>
        </div>
      </div>
    </section>

    <!-- 表单区域 -->
    <section class="form-section">
      <div class="form-container">
        <!-- 左侧：大图背景 + 信息覆盖 -->
        <div class="form-visual">
          <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=900&fit=crop" alt="团队协作" class="visual-bg" />
          <div class="visual-overlay"></div>
          <div class="visual-content">
            <h2>与我们取得联系</h2>
            <p>我们的专业团队随时准备为您提供帮助，让我们一起创造更多可能。</p>
            
            <div class="visual-features">
              <div class="v-feature">
                <span class="v-icon">✓</span>
                <span>免费咨询，无任何隐藏费用</span>
              </div>
              <div class="v-feature">
                <span class="v-icon">✓</span>
                <span>专业团队，一对一服务</span>
              </div>
              <div class="v-feature">
                <span class="v-icon">✓</span>
                <span>快速响应，24小时内回复</span>
              </div>
            </div>
            
            <div class="visual-stats">
              <div class="stat-item">
                <span class="stat-num">500+</span>
                <span class="stat-label">服务客户</span>
              </div>
              <div class="stat-item">
                <span class="stat-num">98%</span>
                <span class="stat-label">满意度</span>
              </div>
              <div class="stat-item">
                <span class="stat-num">24h</span>
                <span class="stat-label">响应时间</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 右侧：表单 -->
        <div class="form-card">
          <div class="form-header">
            <h3>发送消息</h3>
            <p>填写表单，我们会尽快与您联系</p>
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
            
            <el-form-item label="咨询内容" prop="message">
              <el-input
                v-model="formData.message"
                type="textarea"
                :rows="4"
                placeholder="请描述您的需求或问题..."
              />
            </el-form-item>
            
            <el-form-item class="submit-item">
              <el-button 
                type="primary" 
                class="submit-btn"
                :loading="submitting" 
                @click="handleSubmit"
              >
                {{ submitting ? '提交中...' : '提交留言' }}
                <el-icon v-if="!submitting"><Right /></el-icon>
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="faq-section">
      <div class="section-header">
        <span class="section-header__badge">
          <el-icon><QuestionFilled /></el-icon> 常见问题
        </span>
        <h2 class="section-header__title">您可能想了解</h2>
      </div>
      
      <div class="faq-container">
        <el-collapse v-model="activeFaq" accordion>
          <el-collapse-item v-for="(faq, index) in faqs" :key="index" :name="index">
            <template #title>
              <span class="faq-title">{{ faq.question }}</span>
            </template>
            <p class="faq-answer">{{ faq.answer }}</p>
          </el-collapse-item>
        </el-collapse>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import type { ContactForm } from '@/types'

const formRef = ref<FormInstance>()
const submitting = ref(false)
const activeFaq = ref(0)

const formData = reactive<ContactForm>({
  name: '',
  email: '',
  phone: '',
  company: '',
  message: ''
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
  message: [
    { required: true, message: '请输入咨询内容', trigger: 'blur' },
    { min: 10, max: 500, message: '内容在 10 到 500 个字符', trigger: 'blur' }
  ]
}

const faqs = ref([
  {
    question: '你们提供哪些服务？',
    answer: '我们提供企业官网建设、电商平台开发、移动应用开发、数字化转型咨询等全方位的数字化服务。'
  },
  {
    question: '项目周期一般多长？',
    answer: '项目周期根据需求复杂度而定，一般企业官网2-4周，电商平台4-8周，移动应用6-12周。我们会在需求确认后提供详细的项目计划。'
  },
  {
    question: '如何保证项目质量？',
    answer: '我们采用敏捷开发流程，每个迭代都有严格的代码审查和测试环节。项目完成后提供3个月免费维护期。'
  },
  {
    question: '是否提供售后服务？',
    answer: '是的，我们提供7×24小时技术支持，专属客户经理全程跟进，确保您的系统稳定运行。'
  }
])

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        ElMessage.success('留言提交成功，我们会尽快与您联系！')
        formRef.value?.resetFields()
      } catch {
        ElMessage.error('提交失败，请稍后重试')
      } finally {
        submitting.value = false
      }
    }
  })
}

const handleNotImplemented = () => {
  ElMessage.info('功能开发中，敬请期待')
}
</script>

<style lang="scss" scoped>
.contact-page {
  padding-top: $header-height;
}

// ==================== Hero ====================
.page-hero {
  padding: $spacing-3xl $spacing-lg;
  background: $bg-color-light;
  text-align: center;
  
  .hero-badge {
    display: inline-block;
    padding: $spacing-sm $spacing-md;
    background: rgba($primary-color, 0.1);
    color: $primary-color;
    font-size: $font-size-sm;
    font-weight: 600;
    border-radius: $border-radius-full;
    margin-bottom: $spacing-md;
  }
  
  h1 {
    font-size: $font-size-4xl;
    margin-bottom: $spacing-sm;
  }
  
  p {
    font-size: $font-size-lg;
    color: $text-color-secondary;
  }
}

// ==================== 联系卡片 ====================
.contact-cards-section {
  padding: $spacing-3xl $spacing-lg;
  margin-top: -$spacing-3xl;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-lg;
  max-width: $container-max-width;
  margin: 0 auto;
}

.contact-card {
  background: white;
  border: 1px solid $border-color-light;
  border-radius: $border-radius-lg;
  padding: $spacing-xl;
  text-align: center;
  transition: all $transition-normal;
  
  &:hover {
    border-color: transparent;
    box-shadow: $shadow-xl;
    transform: translateY(-4px);
    
    .card-icon {
      background: $gradient-primary;
      color: white;
    }
  }
  
  .card-icon {
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba($primary-color, 0.1);
    color: $primary-color;
    border-radius: $border-radius-md;
    margin: 0 auto $spacing-md;
    transition: all $transition-normal;
    
    .icon-emoji {
      font-size: 28px;
    }
  }
  
  h3 {
    font-size: $font-size-lg;
    margin-bottom: $spacing-xs;
  }
  
  p {
    font-size: $font-size-sm;
    color: $text-color-secondary;
    margin-bottom: $spacing-sm;
  }
  
  .card-link {
    font-size: $font-size-md;
    font-weight: 600;
    color: $primary-color;
  }
}

// ==================== 表单区域 ====================
.form-section {
  padding: $spacing-4xl $spacing-lg;
  background: white;
}

.form-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: $container-max-width;
  margin: 0 auto;
  border-radius: $border-radius-xl;
  overflow: hidden;
  box-shadow: $shadow-2xl;
  min-height: 600px;
}

// 左侧视觉区域
.form-visual {
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
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(139, 92, 246, 0.85) 100%);
  }
  
  .visual-content {
    position: relative;
    z-index: 1;
    padding: $spacing-3xl;
    height: 100%;
    display: flex;
    flex-direction: column;
    color: white;
    
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
  margin-bottom: auto;
  
  .v-feature {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    padding: $spacing-sm 0;
    font-size: $font-size-md;
    
    .v-icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.2);
      border-radius: $border-radius-round;
      font-size: $font-size-sm;
      font-weight: 700;
    }
  }
}

.visual-stats {
  display: flex;
  gap: $spacing-xl;
  padding-top: $spacing-xl;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  
  .stat-item {
    text-align: center;
    
    .stat-num {
      display: block;
      font-size: $font-size-xxl;
      font-weight: 700;
      margin-bottom: $spacing-xs;
    }
    
    .stat-label {
      font-size: $font-size-sm;
      opacity: 0.8;
    }
  }
}

// 右侧表单
.form-card {
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
  }
  
  :deep(.el-form-item__label) {
    font-weight: 600;
    color: $text-color-primary;
    padding-bottom: $spacing-xs;
  }
  
  :deep(.el-input__wrapper),
  :deep(.el-textarea__inner) {
    border-radius: $border-radius-md;
    box-shadow: none;
    border: 1px solid $border-color;
    
    &:hover, &:focus {
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

// ==================== FAQ ====================
.faq-section {
  padding: $spacing-4xl $spacing-lg;
  max-width: 800px;
  margin: 0 auto;
}

.faq-container {
  :deep(.el-collapse) {
    border: none;
  }
  
  :deep(.el-collapse-item) {
    margin-bottom: $spacing-md;
    background: white;
    border: 1px solid $border-color-light;
    border-radius: $border-radius-lg;
    overflow: hidden;
    
    &.is-active {
      border-color: $primary-color;
    }
  }
  
  :deep(.el-collapse-item__header) {
    padding: $spacing-lg;
    font-size: $font-size-md;
    font-weight: 600;
    border: none;
    height: auto;
    line-height: 1.5;
  }
  
  :deep(.el-collapse-item__wrap) {
    border: none;
  }
  
  :deep(.el-collapse-item__content) {
    padding: 0 $spacing-lg $spacing-lg;
  }
}

.faq-title {
  font-weight: 600;
}

.faq-answer {
  font-size: $font-size-md;
  color: $text-color-secondary;
  line-height: $line-height-loose;
}

// ==================== 响应式 ====================
@media (max-width: $breakpoint-lg) {
  .cards-container {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .form-container {
    grid-template-columns: 1fr;
    min-height: auto;
  }
  
  .form-visual {
    min-height: 300px;
    
    .visual-content {
      padding: $spacing-xl;
    }
  }
  
  .visual-stats {
    justify-content: space-around;
  }
}

@media (max-width: $breakpoint-md) {
  .cards-container {
    grid-template-columns: 1fr;
  }
  
  .form-card {
    padding: $spacing-xl;
  }
}
</style>
