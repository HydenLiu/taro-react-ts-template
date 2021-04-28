/*
 * @Description: 接口命名格式：模块名_method<get/post>_接口名
 * @example: search_get_goodsList
 */
const Api = {
  // 用户模块
  'user_post_login': '/login', // 登录

  // 商品搜索接口命名示例如下
  'search_get_goodsList': '/product/mall/search', // 搜索商品列表
}


export default Api


