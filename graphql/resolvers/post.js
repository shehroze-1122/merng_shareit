const postModel = require('../../models/Post.js')

module.exports = {  
    Query:{
        getPosts: async ()=>{
            try {
                const posts = await postModel.find({});
                return posts;
            } catch (error) {
                throw new Error(error)
            }
            
        }
    }
}
