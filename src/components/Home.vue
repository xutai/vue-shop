<template>
  <!-- <div>
      
    </div> -->
  <el-container>
    <el-header>
      <div class="left">
        <img src="../assets/heima.png" alt="" />
        电商后台管理系统
      </div>
      <div class="right">
        <el-button type="info" @click="logout">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse?'64px':'200px'">
          <div class="toggleMenu" @click="collapseMenu">|||</div>
        <el-menu
          @open="handleOpen"
          @close="handleClose"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activeMenu"
        >
        <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="(item) in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span class="icon">{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+subItem.path" v-for="(subItem) in item.children" :key="subItem.id" @click="saveNavMenu('/'+subItem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span >{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
        menuList:[],
        //这种方法很巧妙
        iconsObj: {
        '125':'iconfont icon-user',
        '103':'iconfont icon-tijikongjian',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-danju',
        '145':'iconfont icon-baobiao'
      },
      isCollapse:false,
      activeMenu:""
    };
  },
  created(){
      this.getMenuList();
      this.activeMenu=window.sessionStorage.getItem('nativePath')
  },
  methods: {
      //退出
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    //获取菜单
    async getMenuList() {
        const {data:res}=await this.$http.get('/menus');
        console.log(res);
        if(res.meta.status!==200) {
            return this.$message.error(res.meta.msg);
        }
        this.menuList=res.data;
    },
    //是否折叠菜单
    collapseMenu(){
        this.isCollapse=!this.isCollapse;
    },
    //当前激活菜单的路径
    saveNavMenu(path){
        window.sessionStorage.setItem('nativePath',path);
        this.activeMenu=path;
    },
    handleOpen(){

    },
    handleClose(){

    }
  },
};
</script>
<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  padding: 0;
  background-color: #373d41;
  .left {
    float: left;
    font-size: 26px;
    font-weight: 400;
    color: #fff;
    img {
      vertical-align: middle;
    }
  }
  .right {
    float: right;
    margin: 10px 5px 0 0;
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
      border-right:none;
  }
  .icon {
      margin-left: 5px;
  }
  .toggleMenu {
      color: #fff;
      text-align: center;
      font-size: 12px;
      padding: 2px;
      line-height: 25px;
      cursor: pointer;
  }
}
.el-main {
  background-color: #eaedf1;
}
</style>
