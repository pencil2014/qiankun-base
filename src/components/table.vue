<template>
  <div class="base-table">
    <el-table
      :data="option.data"
      stripe
      style="width: 100%"
      :max-height="option.maxHeight ||'700px'"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-if="option.selection"
        type="selection"
        align="center"
        width="55"
      >
      </el-table-column>
      <el-table-column
        v-if="option.showIndex"
        label="序号"
        align="center"
        width="55"
      >
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        v-for="(item, index) in option.columns"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :min-width="item.minWidth || 80"
        :width="option.columns.length < 15 && parseInt(item.width) < 100 && parseInt(item.width) > 60 ? '' : item.width"
        :align="item.align || 'center'"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span :class="item.className"
            v-html="
              item.formatter
                ? item.formatter(scope.row[item.prop], scope.row)
                : scope.row[item.prop]
            "
          ></span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        :align="option.operationBtns.align || 'center'"
        :label="option.operationBtns.title || '操作'"
        :width="option.operationBtns.width || '120'"
      >
        <template slot-scope="scope">
          <template v-for="(ele, index) in option.operationBtns.data">
            <el-button
              type="text"
              :style="ele.style || {}"
              @click.native.stop="
                option.operationBtns.callback(
                  ele.action,
                  scope.$index,
                  scope.row
                )
              "
            >
              {{ ele.label }}
            </el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box">
       <Pagination
        :config="option.pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
   
  </div>
</template>

<script>
import Pagination from './pagination.vue'
export default {
  name: 'Table',
  props: {
    option: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    Pagination
  },
  data() {
    return {
    }
  },
  methods: {
    handleSelectionChange(val) {
      let id = this.option.id
      this.$emit('selectionChange', id, val)
    },
    handleSizeChange(val) {
      this.option.pagination.callback('SizeChange', val, this.option)
    },
    handleCurrentChange(val) {
      this.option.pagination.callback('CurrentChange', val, this.option)
    },
  }
}
</script>

<style lang='scss' scoped>
.pagination-box{
  margin-top: 10px;
}
</style>