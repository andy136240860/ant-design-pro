const isExisty = value => value !== null && value !== undefined;
const isEmpty = value => value === '';

export function handleCheckName(rule, value, callback) {
    const res = !isExisty(value) || isEmpty(value) || /^[a-zA-Z0-9_-]{4,16}$/.test(value);
    if (res) {
      callback();
    } else {
      callback('请输入正确的姓名');
    }
  }
  export function handleCheckNum(rule, value, callback) {
    const res = !isExisty(value) || isEmpty(value) ||/^[0-9]+$/.test(value);
    if (res) {
      callback();
    } else {
      callback('请输入正确的信息');
    }
  }
  
export function handleCheckID(rule, value, callback) {
  const res = !isExisty(value) || isEmpty(value) || /(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(value);
  if (res) {
    callback();
  } else {
    callback('请输入正确的身份证');
  }
}

export function handleCheckMail(rule, value, callback) {
  const reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
  if (!isExisty(value) || isEmpty(value) || reg.test(value)) {
    callback();
  } else {
    callback('请输入正确的邮箱');
  }
}

export function handleCheckTel(rule, value, callback) {
  // language=JSRegexp
  const mobile = /^1[34578]\d{9}$/;
  // language=JSRegexp
  const phone = /^0\d{2,3}-?\d{7,8}$/;
  if (!isEmpty(value) && (mobile.test(value) || phone.test(value))) {
    callback();
  } else {
    callback('请输入正确的座机号或者手机号');
  }
}

export function handleCheckMobile(rule, value, callback) {
  // language=JSRegexp
  const mobile = /^1[34578]\d{9}$/;
  if (!isExisty(value) || isEmpty(value) || mobile.test(value)) {
    callback();
  } else {
    callback('请输入正确的手机号');
  }
}

export function handleConfirmPwd(rule, lastValue, value, callback) {
  if ((!isExisty(value) && !isExisty(lastValue)) || (isEmpty(value) || isEmpty(lastValue)) || lastValue === value) {
    callback();
  } else {
    callback('两次密码输入不一致');
  }
}
