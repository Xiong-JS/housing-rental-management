import axios from 'axios'

export default function request(config) {
  const instance = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 5000,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  instance.interceptors.request.use(config => {

    let uToken = localStorage.getItem("uToken");
    console.log(uToken);
    if (uToken) {
      console.log(uToken + '----');
      //1.2 注意：给请求头里面添加u-token（后台判断就是取的这个请求头）请求头，并把随机数的token值也设置进去
      config.headers['u-token'] = uToken;
    }
    //1.3 必须要返回这个，才能执行后面代码
    return config;
  }, err => {
    Promise.reject(err);
  })
  return instance(config)
}