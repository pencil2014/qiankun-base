<template>
  <div class="home-page" v-loading="loading">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane
        v-for="(item, index) in tabs"
        :label="item.label"
        :name="item.name"
        :key="index"
      ></el-tab-pane>
    </el-tabs>
    <div class="btn-box" v-show="activeName === 'Msg' && option2.data.length">
      <el-button type="primary" size="mini" @click="readMsg"
        >批量已读</el-button
      >
      <el-button type="danger" size="mini" @click="deleteMsg('')"
        >批量删除</el-button
      >
    </div>
    <Table :option="currentOption" @selectionChange="selectionChange" />
    <el-dialog :title="dialog.title" :visible.sync="dialog.show" width="800">
      <div class="dialog-cnt">
        <template v-if="['Todo', 'Msg'].includes(activeName)">
          <div class="item">
            <b class="title">内容:</b>
            <p class="cnt" v-html="dialog.data.noticeContent"></p>
          </div>
          <div class="item">
            <b class="title">类型:</b>
            <p class="cnt">{{ noticeTypeOptions[dialog.data.noticeType] }}</p>
          </div>
          <div class="item">
            <b class="title">优先级:</b>
            <p class="cnt">
              <span
                class="notice-priority-high"
                v-if="dialog.data.noticePriority == 0"
                >紧急</span
              >
              <span
                class="notice-priority-middle"
                v-if="dialog.data.noticePriority == 1"
                >一般</span
              >
              <span
                class="notice-priority-low"
                v-if="dialog.data.noticePriority == 2"
                >低</span
              >
            </p>
          </div>
          <div class="item">
            <b class="title">关联单号:</b>
            <p class="cnt">{{ dialog.data.keyNo }}</p>
          </div>
          <div class="item">
            <b class="title">通知时间:</b>
            <p class="cnt">{{ dialog.data.noticeTime }}</p>
          </div>
          <div class="item" v-if="dialog.data.viewTime">
            <b class="title">查看时间:</b>
            <p class="cnt">{{ dialog.data.viewTime }}</p>
          </div>
        </template>
        <template v-if="activeName === 'Todo'">
          <div class="item" v-if="dialog.data.closeTime">
            <b class="title">处理完成时间:</b>
            <p class="cnt">{{ dialog.data.closeTime }}</p>
          </div>
        </template>
        <template v-else>
          <div
            class="ql-editor update-image-wrap"
            v-html="dialog.data.noticeContent"
          >
            图文信息
          </div>
        </template>
      </div>
      <div slot="footer">
        <el-button size="mini" @click="dialog.show = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Table from '@/components/table.vue'
import { mixin } from '@/mixin'
import {
  noticeWebsiteList,
  noticeWebsiteRead,
  noticeWebsiteDelete,
  noticeMsgUpgrade
} from '@/api'
import actions from '@/store'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
export default {
  mixins: [mixin],
  components: {
    Table
  },
  data() {
    return {
      loading: false,
      noticeEmployeeId: '',
      defaultQuery: {
        pageSize: 10,
        currPage: 1,
        columns: [],
        ascColumns: [],
        descColumns: ['createdTime'],
        query: []
      },
      tabs: [
        {
          label: '待办事项',
          name: 'Todo'
        },
        {
          label: '业务通知',
          name: 'Msg'
        },
        {
          label: '系统更新',
          name: 'Update'
        }
      ],
      activeName: 'Todo',
      option1: {
        id: 'option1',
        data: [],
        columns: [
          {
            prop: 'noticeContent',
            label: '待办内容',
            width: '800',
            className: 'notice-cnt'
          },
          {
            prop: 'noticeTime',
            label: '通知时间'
          },
          {
            prop: 'noticePriority',
            label: '优先级',
            formatter: (val) => {
              let className = {
                0: 'notice-high',
                1: 'notice-middle',
                2: 'notice-low'
              }
              let text = {
                0: '紧急',
                1: '一般',
                2: '低'
              }
              return `<span class="${className[val]}">${text[val]}</span>`
            }
          },
          {
            prop: 'handleStatus',
            label: '状态',
            formatter: (val) => {
              return val.toLowerCase() === 'y' ? '已处理' : '未处理'
            }
          }
        ],
        operationBtns: {
          with: '100',
          data: [
            {
              label: '详情',
              action: 'detail'
            }
          ],
          callback: (action, index, row) => {
            if (action === 'detail') {
              this.showDetail(row)
            }
          }
        },
        selection: false,
        pagination: {}
      },
      option2: {
        id: 'option2',
        data: [],
        columns: [
          {
            prop: 'noticeContent',
            label: '通知内容',
            className: 'notice-cnt'
          },
          {
            prop: 'noticeTime',
            label: '通知时间'
          }
        ],
        operationBtns: {
          with: '100',
          data: [
            {
              label: '详情',
              action: 'detail'
            },
            {
              label: '删除',
              action: 'delete',
              style: {
                color: '#cd4130'
              }
            }
          ],
          callback: (action, index, row) => {
            if (action === 'detail') {
              this.showDetail(row)
            } else if (action === 'delete') {
              this.deleteMsg(row)
            }
          }
        },
        selection: true,
        pagination: {}
      },
      option3: {
        id: 'option1',
        data: [],
        columns: [
          {
            prop: 'noticeTitle',
            label: '通知标题'
          },
          {
            prop: 'noticeTime',
            label: '通知时间'
          }
        ],
        operationBtns: {
          with: '100',
          data: [
            {
              label: '详情',
              action: 'detail'
            }
          ],
          callback: (action, index, row) => {
            if (action === 'detail') {
              this.showDetail(row)
            }
          }
        },
        selection: false,
        pagination: {}
      },
      currentOption: {},
      multipleSelection1: [],
      dialog: {
        show: false,
        title: '',
        data: {}
      },
      noticeTypeOptions: {
        UPDATE: '系统更新',
        MSG: '业务通知',
        TODO: '待办事项',
        MSG_SYS: '系统通知'
      }
    }
  },
  created() {
    this.currentOption = this.option1
    this.noticeEmployeeId = actions.getGlobalState('userInfo')?.sysUserId
    this.option1.pagination = Object.assign({}, this.pagination, {
      show: true
    })
    this.option2.pagination = Object.assign({}, this.pagination, {
      show: true
    })
    this.option3.pagination = Object.assign({}, this.pagination, {
      show: true
    })
    this.getList()
  },
  methods: {
    selectionChange(id, val) {
      this.multipleSelection1 = val
    },
    handleClick({ name }) {
      this.activeName = name
      if (name === 'Todo') {
        this.currentOption = this.option1
      } else if (name === 'Msg') {
        this.currentOption = this.option2
      } else {
        this.currentOption = this.option3
      }
      this.getList()
    },
    getList() {
      this.loading = true
      let query = ''
      if (this.activeName === 'Todo') {
        query = [
          { column: 'noticeType', type: 'eq', value: 'TODO' },
          { column: 'handleStatus', type: 'eq', value: 'N' },
          {
            column: 'noticeEmployeeId',
            type: 'eq',
            value: this.noticeEmployeeId
          }
        ]
      } else if (this.activeName === 'Msg') {
        query = [
          { column: 'noticeType', type: 'eq', value: 'MSG' },
          {
            column: 'noticeEmployeeId',
            type: 'eq',
            value: this.noticeEmployeeId
          }
        ]
      } else {
        query = [{ column: 'noticeType', type: 'eq', value: 'MSG_UPGRADE' }]
      }
      let { pageSize, currPage } = this.currentOption.pagination
      let data = Object.assign({}, this.defaultQuery, {
        query,
        pageSize,
        currPage
      })
      noticeWebsiteList(data)
        .then((res) => {
          if (res.code === 0) {
            if (this.activeName === 'Todo') {
              this.option1.data = res.data.list
              Object.assign(this.option1.pagination, res.data)
            } else if (this.activeName === 'Msg') {
              this.option2.data = res.data.list
              Object.assign(this.option2.pagination, res.data)
            } else {
              this.option3.data = res.data.list
              Object.assign(this.option3.pagination, res.data)
            }
          }
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    showDetail(row) {
      let type =
        this.activeName === 'Todo'
          ? '[待办]'
          : this.activeName === 'Msg'
          ? '[业务]'
          : '系统更新'
      let { noticeTitle } = row
      let title = ['Todo', 'Msg'].includes(this.activeName)
        ? `${type} ${noticeTitle}`
        : `${type}`
      Object.assign(this.dialog, {
        show: true,
        title,
        data: row
      })
    },
    readMsg() {
      let len = this.multipleSelection1.length
      if (!len) {
        return this.$msgErrClose('请选择需要操作的数据！')
      }
      this.loading = true
      let oids = this.multipleSelection1.map((item) => item.oid)
      noticeWebsiteRead({ oids }).then((res) => {
        this.$msgSucClose('批量已读成功!')
        this.getList()
      })
    },
    deleteMsg(row) {
      if (row) {
        this.$confirmWarn('是否确认删除?', () => {
          this.deleteMsgFn(row)
        })
      } else {
        let len = this.multipleSelection1.length
        if (!len) {
          return this.$msgErrClose('请选择需要删除的数据！')
        }
        this.$confirmWarn('是否确认删除?', () => {
          this.deleteMsgFn()
        })
      }
    },
    deleteMsgFn(row) {
      let oids = []
      if (row) {
        oids = [row.oid]
      } else {
        oids = this.multipleSelection1.map((item) => item.oid)
      }
      noticeWebsiteDelete({ oids }).then((res) => {
        this.$msgSucClose('批量删除成功!')
        this.getList()
      })
    },
    handleSizeChange(val, option) {
      if (option === this.option1) {
        this.option1.pagination.pageSize = val
      } else if (option === this.option2) {
        this.option2.pagination.pageSize = val
      } else {
        this.option3.pagination.pageSize = val
      }
      this.getList()
    },
    handleCurrentChange(val, option) {
      if (option === this.option1) {
        this.option1.pagination.currPage = val
      } else if (option === this.option2) {
        this.option2.pagination.currPage = val
      } else {
        this.option3.pagination.currPage = val
      }
      this.getList()
    },
    getUpdate() {
      noticeMsgUpgrade()
        .then((res) => {
          let { oid } = res.data
          let updateId = localStorage.getItem('updateId') || ''
          if (oid && updateId != oid) {
            this.showDetail(res.data)
            localStorage.setItem('updateId', oid)
          }
        })
        .catch(() => {})
    }
  },
  mounted() {
    this.getUpdate()
  }
}
</script>

<style lang="scss" scoped>
.home-page {
  .btn-box {
    margin-bottom: 10px;
  }
  :deep(.notice-high)  {
    color: #cd4130;
  }
  :deep(.notice-middle)  {
    color: #edb534;
  }
  :deep(.notice-low)  {
    color: #4a4a4a;
  }
  :deep(.notice-cnt)  {
    a {
      color: #3e80f5;
      text-decoration: underline;
    }
  }
  .dialog-cnt {
    max-height: 50vh;
    overflow: auto;
    .item {
      display: flex;
      margin-bottom: 10px;
      .title {
        width: 60px;
        flex-shrink: 0;
        text-align: right;
        margin-right: 10px;
      }
      .cnt {
        flex: 1;
        .notice-priority-high {
          color: #cd4130;
        }
        .notice-priority-middle {
          color: #edb534;
        }
        .notice-priority-low {
          color: #4a4a4a;
        }
      }
    }
    .update-image-wrap {
      img {
        max-width: 100%;
      }
    }
  }
}
</style>
