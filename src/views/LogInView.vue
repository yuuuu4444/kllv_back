<script setup>
  import { useRouter, useRoute } from 'vue-router';
  import Header from '@/components/Header.vue';
  import { ref } from 'vue';
  import { ElMessage } from 'element-plus';
  import { useAuthStore } from '@/stores/auth';

  const buttonColor = ref('#004b80');
  const textColor = ref('#fff');

  const router = useRouter();
  const route = useRoute();
  const auth = useAuthStore();

  const formRef = ref();
  const form = ref({
    username: '',
    password: '',
  });

  const rules = {
    username: [{ required: true, message: '請輸入帳號', trigger: 'blur' }],
    password: [{ required: true, message: '請輸入密碼', trigger: 'blur' }],
  };

  const handleLogin = () => {
    formRef.value?.validate(async (valid) => {
      if (!valid) return ElMessage.error('請完整填寫表單');

      const ok = await auth.login({
        username: form.value.username.trim(),
        password: form.value.password,
      });

      if (ok) {
        ElMessage.success('登入成功');
        const redirect =
          typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard';
        router.replace(redirect); // 用 replace 避免返回鍵回到登入頁
      } else {
        ElMessage.error(auth.error || '登入失敗');
      }
    });
  };
</script>

<template>
  <div class="common-layout">
    <Header></Header>
    <el-container>
      <el-main>
        <div class="login">
          <h1>登入</h1>
          <div class="login-form">
            <el-form
              ref="formRef"
              :model="form"
              :rules="rules"
              label-width="0"
              label-position="top"
              @keydown.enter.prevent="handleLogin"
            >
              <el-form-item
                label="帳號"
                prop="username"
              >
                <el-input
                  v-model="form.username"
                  autocomplete="username"
                />
              </el-form-item>
              <el-form-item
                label="密碼"
                prop="password"
              >
                <el-input
                  v-model="form.password"
                  type="password"
                  autocomplete="current-password"
                  show-password
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  :style="{
                    backgroundColor: buttonColor,
                    color: textColor,
                  }"
                  :loading="auth.loading"
                  :disabled="auth.loading"
                  @click="handleLogin"
                  class="login-btn"
                >
                  登入
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped lang="scss">
  .el-main {
    padding: 0;
  }

  .login {
    width: 500px;
    margin: auto;
    margin-top: 150px;
    h1,
    .login-form {
      text-align: center;
      font-size: 36px;
      width: 100%;
    }
  }

  .el-form-item {
    width: 100%;
  }

  ::v-deep(.el-form-item__label) {
    justify-content: flex-start;
    font-size: 20px;
  }

  .login-btn {
    width: 100%;
    height: 40px;
    font-size: 20px;
    margin-top: 10px;
  }
</style>
