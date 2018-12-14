export const rando = () => {
  let alf = 'abcdefghijklmnopqrstuvwxyz'
  let str = ''
  for (let i=0; i<10; i++) {
    str+= alf[Math.floor(Math.random()*26)]
  }
  return str
}