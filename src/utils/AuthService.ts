class AuthService {
    token: string | null = uni.getStorageSync('token') || null;
  
    // 登录
    login(): Promise<void> {
      return new Promise((resolve, reject) => {
        uni.login({
          provider: 'weixin',
          success: (res) => {
            if (res.code) {
              uni.request({
                url: 'https://your-api.com/login',
                method: 'POST',
                data: { code: res.code },
                success: (res) => {
                  if (res.data.token) {
                    this.token = res.data.token;
                    uni.setStorageSync('token', res.data.token);
                    console.log('登录成功');
                    resolve();
                  } else {
                    reject('登录失败');
                  }
                },
                fail: (err) => reject(err)
              });
            } else {
              reject('获取 code 失败');
            }
          },
          fail: (err) => reject(err)
        });
      });
    }
  
    // 退出登录
    logout() {
      this.token = null;
      uni.removeStorageSync('token');
      console.log('用户已退出');
      uni.reLaunch({ url: '/pages/login/login' });
    }
  
    // 更新用户信息
    updateUserInfo(userInfo: any): Promise<void> {
      return new Promise((resolve, reject) => {
        if (!this.token) return reject('未登录');
  
        uni.request({
          url: 'https://your-api.com/user/update',
          method: 'POST',
          data: userInfo,
          header: { 'Authorization': 'Bearer ' + this.token },
          success: (res) => {
            if (res.data.success) {
              console.log('用户信息更新成功');
              resolve();
            } else {
              reject('用户信息更新失败');
            }
          },
          fail: (err) => reject(err)
        });
      });
    }
  }
  
  // 导出单例，保证全局唯一
  export default new AuthService();
  