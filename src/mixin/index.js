export const mixin = {
  data () {
    return {
      pagination: {
        hasNextPage: false,
        hasPreviousPage: false,
        isFirstPage: false,
        isLastPage: false,
        show: false,
        currPage: 1,
        pageSize: 10,
        totalCount: 0,
        total: 0,
        callback: (action, val, option) => {
          if (action === 'SizeChange') {
            this.handleSizeChange(val, option)
          } else if (action === 'CurrentChange') {
            this.handleCurrentChange(val, option)
          }
        }
      }
    }
  }
}