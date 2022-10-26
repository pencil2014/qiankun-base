<template>
  <el-dialog title="邮件订阅" width="800px" :visible.sync="option.show"
      :close-on-click-modal="false">
    <div class="email-book">
      <div class="tip">
        注意：仅非白名单客户的以下邮件提醒，支持配置是否推送提醒，提醒的频次。
      </div>
      <div class="table-class">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="groupName" align="center" label="提醒类型">
          </el-table-column>
          <el-table-column prop="isSubscribe" align="center" label="邮件订阅">
            <template slot-scope="scope">
              <el-radio-group size="mini" v-model="scope.row.isSubscribe">
                <el-radio
                  v-for="(item, index) in radioList"
                  :key="index"
                  :label="item.value"
                  >{{ item.label }}</el-radio
                >
              </el-radio-group>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div slot="footer">
      <el-button type="primary" @click="submit" size="mini">确认</el-button>
      <el-button @click="cancel" size="mini">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getSubscribeList, unsubscribe } from '@/api/index'
export default {
  props: {
    option: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      radioList: [
        { label: '提醒', value: 'Y' },
        { label: '不提醒', value: 'N' }
      ],
      tableData: []
    }
  },
  created() {
    this.getSubscribeListData()
  },
  methods: {
    getSubscribeListData() {
      getSubscribeList({}).then((res) => {
        this.tableData = res.data || []
      })
    },
    getData() {
      return this.tableData.map((item) => {
        if (item.isSubscribe === 'N') {
          return item.groupType
        }
      })
    },
    cancel() {
      this.$emit('cancel')
    },
    submit() {
      let groupTypes = this.getData()
      unsubscribe({ groupTypes }).then((res) => {
        this.$message.success('订阅成功')
        this.cancel()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
:deep(.el-dialog__body) {
  padding: 20px;
}
.email-book {
  .tip {
    color: red;
  }
  .table-class {
    margin-top: 10px;
  }
  :deep(.el-radio__label) {
    font-size: 12px;
  }
}
</style>
