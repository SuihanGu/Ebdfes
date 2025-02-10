import HttpRequest from '@/libs/axios'
import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev1 : config.baseUrl.pro1
let obj = {}
for(let i in baseUrl){
    let axios='axios'+i
    obj[axios]=new HttpRequest(baseUrl[i])
}
export default obj

