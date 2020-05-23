export const rando = () => {
  let alf = 'abcdefghijklmnopqrstuvwxyz'
  let str = ''
  for (let i=0; i<10; i++) {
    str+= alf[Math.floor(Math.random()*26)]
  }
  return str
}

export const processStr = (str) => {
  let res = str.replace(/(\\)/g, "\\\\");
  return res;
};

export const isLetter = (str) => {
  let patt = /[a-zA-Z]/g
  return patt.test(str)
}