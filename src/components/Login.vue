<template>
  <div class="box">
    <div class="box-in">
      <div class="avater">
        <img src="../assets/logo.png" alt="" />
      </div>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      },
      loginFormRules: {
        username: [
          { required: true, message: "请输入名称", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    login() {
        //发送请求之前校验
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) {
          return;
        }
        const { data: res } = await this.$http.post("login", this.loginForm); //对象解构
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg);
        }
        this.$message.success("登陆成功");
        window.sessionStorage.setItem("token", res.data.token);
        this.$router.push("/home");
      });
    },
    //重置表单
    reset() {
      this.$refs.loginFormRef.resetFields();
    },
  },
};
</script>
<style scoped lang="less">
.box {
  position: relative;
  height: 100%;
  background-color: #2b4b6b;
}
.box-in {
  position: absolute;
  top: 200px;
  left: 50%;
  transform: translateX(-50%);
  width: 450px;
  height: 304px;
  background-color: #fff;
  .avater {
    position: absolute;
    left: 50%;
    transform: translateX(-50%) translateY(-50%); //走自己的一半
    width: 148px;
    height: 148px;
    background-color: #fff;
    border-radius: 50%;
    overflow: hidden;
    padding: 8px;
    box-shadow: 0 0 10px #eee; //盒子阴影
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .el-form {
    margin: 110px 10px 0;
    .el-form-item:nth-child(3) {
      margin-left: 280px;
    }
  }
}
</style>
