const {format} = require("date-fns");

class RecordsApi {
    constructor(client,res,req){
        this.client = client;
        this.res = res;
        this.req = req;
        this.results = {};
    }

    async retrieveRecords(){
        //lets update the image urls first 

        // console.log(new Date(new Date().getTime()));
        //     const response = await this.client.find().toArray();
        //     for(let i=0;i<response.length;i++){
        //         // const generateImageHeight = Math.floor((Math.random() * 1000) / 1.5);
        //         const generateImageWidth = Math.floor((Math.random() * 1000) / 1.5);
        //         const updatedUrls = this.client.updateOne({
        //             "_id": response[i]._id
        //         }, {
        //             $set: {
        //                 "imageurl": `https://picsum.photos/300/200?random=${i}`
        //             }
        //         });
        //         this.results.result = updatedUrls;
            //}

        //let us paginate the api for easy retrieval
        const count = await this.client.countDocuments();
        const {page,pageSize} = this.req.query;
        const startIndex = (page-1)*pageSize;
        const endIndex = page*pageSize;
        if(endIndex < count){
            this.results.next = {
                page:parseInt(page)+1,
                limit:parseInt(pageSize)
            }
        }
        if(startIndex > 0){
            this.results.previous = {
                page:parseInt(page)-1,
                limit:parseInt(pageSize)
            }
        }
        
        const response = await this.client.find().limit(parseInt(pageSize)).skip(parseInt(startIndex)).toArray();
        const result = Array.isArray(response) && response.length > 0 ? response.map(records=>RecordsApi.reducedRecords(records)):[];
        this.results.result = result;
        this.res.status(200).json(this.results);
     }

    static reducedRecords(records){
        records && (records.created_at = format(records.created_at,"yyyy-MM-dd"));
        return records;
    }
}

module.exports = RecordsApi;