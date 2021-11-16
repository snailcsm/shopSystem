<template>
  <div class="roles">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/rights' }">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="page-contain">
      <!--添加角色按钮-->
      <el-button type="primary" icon="el-icon-plus" @click="toAddRole">添加角色</el-button>

      <!--角色列表-->
      <el-table :data="roleData" style="width: 100%" border @expand-change="getUserRight">
        <!--展开列-->
        <el-table-column width="55" type="expand">
          <template slot-scope="scope">
            <el-row class="tb-bottom" :id="scope.row.id" v-for="tag in firstR" :key="tag.id">
              <el-col :span="3">
                <el-tag class="right-tag" closable @close="removeRight(scope.row,tag)">{{tag.authName}}</el-tag>
              </el-col>
              <el-col :span="21">
                <el-row class="tb-bottom" v-for="tag2 in secondR.filter(p=>p.pid==tag.id)" :key="tag2.id">
                  <el-col class="tb-left" :span="3">
                    <el-tag class="right-tag" closable type="danger" @close="removeRight(scope.row,tag2)">
                      {{tag2.authName}}
                    </el-tag>
                  </el-col>
                  <el-col class="tb-left" :span="18">
                    <el-tag class="right-tag" v-for="tag3 in thirdR.filter(p=>p.pid==tag2.id)" :key="tag3.id"
                            type="warning" closable @close="removeRight(scope.row,tag3)">{{tag3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column width="80" type="index" label="序号"></el-table-column>
        <el-table-column label="角色名称" prop="rolerTitle" width="300"></el-table-column>
        <el-table-column prop="itro" label="角色简介"></el-table-column>
        <el-table-column label="操作" width="400">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="toEditRole(scope.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deleteRol(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-set" @click="dispachRight">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--添加角色对话框-->
      <el-dialog title="添加新角色" :visible.sync="addRoleDialog" @close="clearInfo">
        <el-form :model="newRole" ref="addRoleRef" :rules="rules">
          <el-form-item label="角色名称：" :label-width="formLabelWidth" prop="rolerTitle">
            <el-input v-model="newRole.rolerTitle" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色描述：" :label-width="formLabelWidth" prop="itro">
            <el-input v-model="newRole.itro" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeAdd">取 消</el-button>
          <el-button type="primary" @click="addRole">确 定</el-button>
        </div>
      </el-dialog>

      <!--编辑角色对话框-->
      <el-dialog title="编辑角色" :visible.sync="editRoleDialog" @close="clearSet">
        <el-form :model="editRoleData" ref="editRoleRef" :rules="rules">
          <el-form-item label="角色名称：" :label-width="formLabelWidth" prop="rolerTitle">
            <el-input v-model="editRoleData.rolerTitle" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色描述：" :label-width="formLabelWidth" prop="itro">
            <el-input v-model="editRoleData.itro" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeEdit">取 消</el-button>
          <el-button type="primary" @click="editRole">确 定</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
  export default {
    name: "Roles",
    data() {
      return {
        roleData: [],
        serverData: [],
        rightData: [],
        fR: [],//存放所有一级权限
        sR: [],//存放所有二级权限
        tR: [],//存放所有三级权限
        firstR: [],//存放当前用户的一级权限
        secondR: [],
        thirdR: [],
        /////////////////////
        formLabelWidth: '200px',
        addRoleDialog: false,
        newRole: {
          rolerTitle: '',
          itro: ''
        },
        editRoleDialog: false,
        editRoleData: {
        },
        rules: {
          rolerTitle: [{required: true, message: '请输入角色名称', trigger: 'blur'}],
          itro: [{required: true, message: '请输入角色介绍', trigger: 'blur'}]
        }
      }
    },
    created() {
      this.getRoleData();
      this.getRightData();
    },
    methods: {
      //发送网络请求获取角色数据
      getRoleData() {
        this.$http.get('/role').then((res => {
          //console.log(res.data);
          this.roleData = res.data;
          this.serverData = res.data;
        }))
      },
      //发送网络请求获取权限数据
      getRightData() {
        this.$http.get('/rights').then((res => {
          this.rightData = res.data;
          this.fR = this.rightData.filter(r => {
            return r.leval === 1
          })
          this.sR = this.rightData.filter(r => {
            return r.leval === 2
          })
          this.tR = this.rightData.filter(r => {
            return r.leval === 3
          });
        }))
      },
      getUserRight(row) {
        this.firstR = [];
        this.secondR = [];
        this.thirdR = [];
        const rightArry = row.rights.split(',');
        new Promise((resolve) => {
          for (let i = 0; i < rightArry.length; i++) {
            this.tR.filter(r => {
              if (r.id === rightArry[i]) {
                this.thirdR.push(r);
              }
              ;
            });
            resolve();
          }
        }).then(() => {
          return new Promise((resolve) => {

            for (let j = 0; j < this.thirdR.length; j++) {
              this.sR.filter(r2 => {
                if (r2.id == this.thirdR[j].pid) {
                  if (this.secondR.indexOf(r2) < 0) {
                    this.secondR.push(r2);
                  }
                }
              })
            }
            ;
            resolve();
          }).then(() => {
            return new Promise(resolve => {
              for (let n = 0; n < this.secondR.length; n++) {
                this.fR.filter(r3 => {
                  if (r3.id == this.secondR[n].pid) {
                    if (this.firstR.indexOf(r3) < 0) {
                      this.firstR.push(r3);
                    }
                  }
                })
              }

            })
          })
        })
      },
      //tag点击删除
      removeRight(roleObj, rightObj) {
        //更新每一个级别的权限
        if (rightObj.leval == 3) {
          this.thirdR = this.thirdR.filter(r => {
            return r.id !== rightObj.id;
            roleObj.rights = this.deleteRight(roleObj, rightObj.id);
          });

          //如果子权限删除完了，对应的父权限也删除
          let resultObj = this.countRemain(this.thirdR, rightObj.pid, this.secondR);//删除二级权限
          this.secondR = resultObj.prevRight;
          let resultObj2 = this.countRemain(this.secondR, resultObj.nextPid, this.firstR);//删除一级权限
          this.firstR = resultObj2.prevRight;

        }
        if (rightObj.leval == 2) {
          this.secondR = this.secondR.filter(r => {
            return r.id !== rightObj.id;
            this.thirdR = this.thirdR.filter(r3 => {
              return r3.pid !== r2.id;
              roleObj.rights = this.deleteRight(roleObj, r3.id);

            })

          });
          let resultObj3 = this.countRemain(this.secondR, rightObj.pid, this.firstR);//删除一级权限
          this.firstR = resultObj3.prevRight;
        }
        if (rightObj.leval == 1) {
          this.firstR = this.firstR.filter(r => {
            if (r.id == rightObj.id) {
              this.secondR = this.secondR.filter(r2 => {
                if (r2.pid == r.id) {
                  this.thirdR = this.thirdR.filter(r3 => {
                    if (r3.pid == r2.id) {
                      roleObj.rights = this.deleteRight(roleObj, r3.id);
                    }
                    return r3.pid !== r2.id;
                  })
                }
                return r2.pid !== r.id;
              })
            }

            return r.id !== rightObj.id;
          })
        }

      },
      //更新用户的权限
      deleteRight(roleObj, rid) {
        // console.log(roleObj)
        let str = rid + ",";
        let sss = "";
        //  console.log("str"+str+"---rid"+rid)
        if (roleObj.rights.indexOf(str) > -1) {
          sss = roleObj.rights.replace(str, "");
        } else {
          sss = roleObj.rights.replace("," + rid, "");
        }
        //  console.log(sss)
        return sss;
      },
      //子权限删除后自动删除父权限
      countRemain(rightArry, pid, prevRight) {
        let count = rightArry.reduce((pre, cur) => {
          if (cur.pid == pid) {
            pre++;
          }
          return pre;
        }, 0);

        let nextPid = -1;
        if (count == 0) {
          prevRight = prevRight.filter(item => {
            if (item.id == pid) {
              nextPid = item.pid;
            }
            return item.id != pid;
          })

          // console.log(prevRight)
        }
        return {nextPid, prevRight};
      },

      //////////////////////////////////////
      //删除角色
      deleteRol(id) {
        this.roleData = this.roleData.filter(item => {
          return item.id !== id;
        })
      },
      //点击分配权限
      dispachRight() {
        this.$message.info('正在建设中')
      },
      //点击添加角色
      toAddRole() {

        this.addRoleDialog = true;
      },
      closeAdd() {
        this.addRoleDialog = false;

      },
      addRole() {
        this.$refs.addRoleRef.validate((value, obj) => {
          if (value) {
            this.roleData.unshift(JSON.parse(JSON.stringify(this.newRole)));
            this.$message.success("添加成功");
            this.addRoleDialog = false;
          } else {
            return this.$message.error(obj[Object.keys(obj)[0]][0].message);
          }
        })
      },
      clearInfo() {
        this.$refs.addRoleRef.resetFields();
      },
      toEditRole(value) {
        this.editRoleData = JSON.parse(JSON.stringify(value));
        this.editRoleDialog = true;

      },
      closeEdit() {
        this.editRoleDialog = false;
      },
      editRole() {

        this.$refs.editRoleRef.validate((value, obj) => {
          if (value) {
              this.roleData.forEach(item=>{
              if(item.id== this.editRoleData.id){
                item.itro=this.editRoleData.itro;
                item.rolerTitle=this.editRoleData.rolerTitle;
              }
                this.$message.success('修改成功！'+this.editRoleData.itro);
            })
         this.editRoleDialog = false;
          } else {
            return this.$message.error(obj[Object.keys(obj)[0]][0].message);
          }
        })
      },
      clearSet() {
        this.$refs.editRoleRef.resetFields();
      }


    }
  }

</script>

<style scoped>
  .tb-bottom {
    border-bottom: 1px #8f9cad solid;
  }

  .tb-bottom:last-child {
    border: none;
  }

  .tb-left {
    border-left: 1px #8f9cad solid;
  }

  .right-tag {
    margin: 5px;
  }
</style>
