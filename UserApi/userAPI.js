const { headers,baseUrl } = require("../config/Config");

class userApi{
    constructor(request){
        this.request=request;
    }
    async createUser(data){
       return await this.request.post(`${baseUrl}/objects`,{
        headers,
        data
    });

    }
    async getUser(id){
        return await this.request.get(`${baseUrl}/objects/${id}`,{
                            headers
        });
    }
    async updateData(id,data){
        return await this.request.put(`${baseUrl}/objects/${id}`,{
            headers,
            data
        });
        
    }
    async deleteData(id){
        return this.request.delete(`${baseUrl}/objects/${id}`,{
                 headers
        }
    )
    }
    disposeApi(){
       return this.request.dispose();
    }
}
module.exports={userApi};