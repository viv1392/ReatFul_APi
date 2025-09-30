const{test,expect}=require('../fixture/FixtureTest');
const{SchemaValidator }=require('../utils/SchemaValidation');
const {productSchema }= require('../schema/productSchema');
const{ productPayload}=require('../utils/testData');

    test.describe.serial('Rest Api Test',()=>{
           let iD='';
           const validator=new SchemaValidator();
    test('Post product',async({userApi})=>{
       const payLoad = productPayload();
       const response= await userApi.createUser(payLoad);
       expect(response.status()).toBe(200);
       expect(response.ok()).toBeTruthy();
       const responsebody= await response.json();
       console.log('posted data',responsebody);
       iD=responsebody.id
       console.log(responsebody);
       expect(responsebody).toHaveProperty('id', iD); 
       validator.validateSchema(productSchema,responsebody);

          
    });
    test('Get Product',async({userApi})=>{
        if(iD!=''){
        const response=await userApi.getUser(iD);
        expect(response.status()).toBe(200);
        const Data= await response.json();
        console.log('get Data :',Data);
        expect(Data).toHaveProperty('name','Apple MacBook Pro 16');
        expect(Data).toHaveProperty('data.CPU model','Intel Core i9');
        expect(Data).toHaveProperty('data.Hard disk size','1 TB');
        expect(Data).toHaveProperty('data.price',1849.99);
        }
    });
    test('Update Product',async({userApi})=>{

     const payload= productPayload();
     const updatedpayload={
                            ...payload,
                            data: {
                             ...payload.data,
                            year: payload.data.year + 1, // dynamic increment
                            price: payload.data.price + 100, // new price
                            }
  };
        if(iD!=''){
        const response=await userApi.updateData(iD,updatedpayload);
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);
        const data=await response.json();
        validator.validateSchema(productSchema,data);
        

        }
    })
    test('Delete Product',async({userApi})=>{
        if(iD!=''){
        const response=await userApi.deleteData(iD);
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);
        const Data= await response.json();
        console.log('Delete message: ', Data);
        validator.validateSchema(productSchema,Data);
        }
    })
    test.afterAll('User Clen Up',async({userApi})=>{
        try{
       await userApi.deleteData(iD);
        }
        catch(err){
         console.log("User already deleted, cleanup skipped.");
        }
       await userApi.disposeApi();      
    })

});
 


// allure report generation
// # Allure Playwright reporter
//npm install -D allure-playwright

//# Allure command line (for generating HTML reports)
//npm install -g allure-commandline --save-dev

//allure --version
//allure generate allure-results --clean -o allure-report
//allure open allure-report

