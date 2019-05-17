import { routerRedux } from 'dva/router';
// Operation Cookie
export function getCookie(name) {
  const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
  const arr = document.cookie.match(reg);

  if (arr) {
    return decodeURIComponent(arr[2]);
  } else {
    // if(name == 'XSRF-TOKEN' ){
      // const { dispatch } = store;
      
      // dispatch(routerRedux.push('/user/login'));
      // return
    // }
    return null;
  }
}

export function delCookie({ name, domain, path }) {
  if (getCookie(name)) {
    document.cookie = `${name}=; expires=Thu, 01-Jan-70 00:00:01 GMT; path=${path}; domain=${domain}`;
  }
}

export function getQueryString(url) {
  const theRequest = {};
  if (url.indexOf('?') !== -1) {
    const s = url.substr(1);
    const str = s.split('&');
    for (const t in str) {
      theRequest[str[t].split('=')[0]] = decodeURI(str[t].split('=')[1]);
    }
  }
  return theRequest;
}
