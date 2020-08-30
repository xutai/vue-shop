<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="query"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addUser">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" border style="width: 100%">
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话" width="180">
        </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="changeStatus(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editUser(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delUser(scope.row)"
            ></el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      :title="text"
      :visible.sync="addUserDialog"
      width="50%"
      :before-close="handleClose"
    >
      <el-form
        ref="userFormRef"
        :model="userForm"
        label-width="80px"
        :rules="userFormRules"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="userForm.username"
            :disabled="!isVisible"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" :prop="isVisible?'password':''" v-show="isVisible">
          <el-input v-model="userForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addUserForm">确 定</el-button>
        <el-button @click="cancelUserForm">取 消</el-button>
      </span>
    </el-dialog>
   
  </div>
</template>
<script>
export default {
  data() {
    //验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/;
      if (regEmail.test(value)) {
        return cb();
      }
      //返回一个错误提示
      cb(new Error("请输入合法的邮箱"));
    };
    //验证手机号码的规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^1[34578]\d{9}$/;
      if (regMobile.test(value)) {
        return cb();
      }
      //返回一个错误提示
      cb(new Error("请输入合法的手机号码"));
    };
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      userList: [],
      total: null,
      addUserDialog: false,
      userForm: {
        username: "",
        password: "",
        email: "",
        mobile: null,
      },
      //  { validator: validatePass, trigger: 'blur' }
      userFormRules: {
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
          { required: true, message: "请输入名称", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      isVisible: true,
      userId: "",
      text:"新增用户"
    };
  },
  watch:{
    //监听是新增用户还是编辑用户
    isVisible(val){
      this.text=val?"新增用户":"编辑用户";
    }
  },
  created() {
    this.getUserList();
  },
  methods: {
    //获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.get("/users", {
        params: this.queryInfo,
      });
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getUserList();
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getUserList();
    },
    query() {
      this.getUserList();
    },
    //改变状态
    async changeStatus(row) {
      const { data: res } = await this.$http.put(
        `users/${row.id}/state/${row.mg_state}`
      );
      if (res.meta.status !== 200) {
        row.mg_state = !row.mg_state;
        return this.$message.error("修改状态失败");
      }
    },
    //新增用户的弹框
    addUser() {
      this.isVisible = true;
      this.addUserDialog = true;
    },
    //点击取消
    cancelUserForm() {
      this.addUserDialog = false;
      this.handleClose();
    },
    addUserForm() {
      this.$refs.userFormRef.validate(async (valid) => {
        if (!valid) {
          return;
        }
        if (this.isVisible) {
          //新增用户
          const { data: res } = await this.$http.post("users", this.userForm);
          if (res.meta.status !== 201) {
            return this.$message.error("添加失败");
          }
          this.$message.success("添加成功");
        } else {
          //编辑用户
          const { data: res } =await this.$http.put(
            `users/${this.userId}`,
            this.userForm
          );
          if (res.meta.status !== 200) {
            return this.$message.error("更新失败");
          }
          this.$message.success("更新成功");
        }
        this.getUserList();
        this.addUserDialog = false;
      });
    },
    //关闭表单
    handleClose() {
      this.addUserDialog = false;
      this.$refs.userFormRef.resetFields();
    },
    //修改
    editUser(row) {
      this.userId = row.id;
      this.isVisible = false;//用户名禁用掉
      this.addUserDialog = true;
      this.userForm.username = row.username;
      this.userForm.email = row.email;
      this.userForm.mobile = row.mobile;
    },
    //删除用户
    delUser(row){
         this.$confirm('确定要删除该用户吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const {data:res}=await this.$http.delete(`users/${row.id}`);
          if(res.meta.status!==200){
            this.$message.error("删除失败");
          }
          this.$message.success("删除成功");
          this.getUserList();
        }).catch(() => {
           this.$message.info("已取消删除");         
        });
    }
  },
};
</script>
<style lang="less" scoped>
.el-card {
  margin-top: 10px;
  .el-table {
    margin: 10px 0;
  }
}
</style>
