<script setup>
  import { RouterLink, RouterView, useRouter } from 'vue-router';
  import Header from '@/components/Header.vue';
  import { ref } from 'vue';
  import { ElMessage } from 'element-plus';
  const buttonColor = ref('#004b80');
  const textColor = ref('#fff');
  const router = useRouter();

  const form = ref({
    username: '',
    password: '',
  });

  const rules = {
    username: [{ required: true, message: '請輸入帳號', trigger: 'blur' }],
    password: [{ required: true, message: '請輸入密碼', trigger: 'blur' }],
  };

  const formRef = ref();

  const handleLogin = () => {
    formRef.value.validate((valid) => {
      if (valid) {
        ElMessage.success('登入成功');
        router.push('/admin');
      } else {
        ElMessage.error('請完整填寫表單');
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
            >
              <el-form-item
                label="帳號"
                prop="username"
              >
                <el-input v-model="form.username" />
              </el-form-item>
              <el-form-item
                label="密碼"
                prop="password"
              >
                <el-input
                  v-model="form.password"
                  type="password"
                  autocomplete="off"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  block
                  :style="{
                    backgroundColor: buttonColor,
                    color: textColor,
                  }"
                  @click="handleLogin"
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

  ::v-deep(.el-button) {
    width: 100%;
    font-size: 20px;
  }
</style>
