
const { expect } = require('playwright/test');
const { userApi } = require('../UserApi/userAPI');
const base=require('@playwright/test').test;

   const test=base.extend({
     userApi:async({request},use)=>{
             await use(new userApi(request))
                                  }

   });
   module.exports={test,expect};