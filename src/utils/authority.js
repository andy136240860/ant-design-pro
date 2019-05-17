import fetch from 'dva/fetch';
import request from './request';
import { getCookie } from './helper';

// use localStorage to store the authority info, which might be sent from server in actual project.
// let curAuthority = 'guest';
export function getAuthority() {
 // console.info(localStorage.getItem('authority'));
  // let cur = localStorage.getItem('authority');
  // if ()
  // let t = checkAuthority();
 // console.info(t);
  if (!localStorage.authority) {
    return 'guest';
  }
  try {
    const { timestamp, auth } = JSON.parse(localStorage.authority);
    if (!timestamp || !auth || timestamp + 60 * 60 * 1000000000 < new Date().getTime()) {
      localStorage.clear();
      return 'guest';
    }
    if (!timestamp || !auth) {
      localStorage.clear();
      return 'guest';
    }
    // if (!auth) {
    //   localStorage.clear();
    //   return 'guest';
    // }
    return auth;
  } catch (e) {
    // 不做处理，需要重新登录
     // console.log(e)
  }
  return 'guest';
  // return curAuthority;
}

export function getUserInfo() {
  if (!localStorage.authority) {
    return null;
  }
  try {
    const { userInfo } = JSON.parse(localStorage.authority);
    if (!userInfo) {
      localStorage.clear();
      return null;
    }
    return userInfo;
  } catch (e) {
    // 不做处理，需要重新登录
  }
  return null;
  // return curAuthority;
}
// setAuthority('guest');
export function setAuthority(authority, userInfo) {
  // curAuthority = authority;
  // return curAuthority;
  // return localStorage.setItem('authority', authority);
  localStorage.authority = JSON.stringify({
    timestamp: new Date().getTime(),
    auth: authority,
    userInfo: userInfo,
  });
  return authority;
}

export function clearAuthority() {
  localStorage.clear();
}

const url = 'http://admin.doctor.alpha.flashdiet.cn/api/user/info';
async function checkAuthority() {
  fetch(url, {
    credentials: 'include',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
    },
  })
    .then(response => {
       // console.log(response)
     // console.info(response.text());
      // let t = JSON.parse(response.text());
      // if (t && t.data && t.status === 0) {
      //   return (t.data.type === 0 ? 'admin' : 'guest');
      // }
      return response.json();
    })
    .catch(e => {
       // console.info(e);
      localStorage.clear();
      return 'guest';
    });
}

//  // console.info(checkAuthority);
// export default checkAuthority;
