<script setup>
  import { RouterLink } from 'vue-router';
  import 'element-plus/dist/index.css';
</script>

<template>
  <el-aside width="18.75%">
    <div class="block">
      <el-avatar :size="100">
        <img
          src="../assets/image/avatar.png"
          alt="avatar_pic"
        />
      </el-avatar>
      <p>里長</p>
      <p>ABC123</p>
    </div>
    <el-row class="tac">
      <el-col :span="12">
        <el-menu
          router
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
        >
          <el-menu-item index="/admin">管理員管理</el-menu-item>
          <el-menu-item index="/village_chief">里長資料管理</el-menu-item>
          <el-menu-item index="/news">最新消息管理</el-menu-item>
          <el-sub-menu index="events-group">
            <template #title>
              <!-- <el-icon><icon-menu /></el-icon> -->
              <span>活動報名管理</span>
            </template>
            <el-menu-item index="/events_content">活動內容管理</el-menu-item>
            <el-menu-item index="/events_signup">報名資料管理</el-menu-item>
          </el-sub-menu>
          <el-menu-item index="/repair">維修通報管理</el-menu-item>
          <el-sub-menu index="comments-group">
            <template #title>
              <!-- <el-icon><icon-menu /></el-icon> -->
              <span>討論區管理</span>
            </template>
            <el-menu-item index="/post_review">文章檢舉審核</el-menu-item>
            <el-menu-item index="/comments_review">留言檢舉審核</el-menu-item>
          </el-sub-menu>
          <el-menu-item index="/households">戶籍資料管理</el-menu-item>
        </el-menu>
      </el-col>
    </el-row>
  </el-aside>
</template>

<style scoped lang="scss">
  .el-col-12 {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .block {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 15px 35px;
    border-right: 1px solid #ccc;
    p {
      font-size: 20px;
    }
  }

  .el-menu-item,
  .el-sub-menu {
    span {
      font-size: 20px;
    }
    font-size: 20px;
    margin: 20px;
  }

  .el-sub-menu {
    ::v-deep(.el-sub-menu__icon-arrow) {
      font-size: 18px;
    }
  }

  .el-avatar {
    --el-avatar-bg-color: none;
  }

  .menu-link {
    display: inline-block;
    width: 100%;
    color: inherit;
    text-decoration: none;
  }
</style>
