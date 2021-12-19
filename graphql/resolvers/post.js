const { UserInputError } = require('apollo-server')
const { AuthenticationError } = require('apollo-server');

const postModel = require('../../models/Post.js')
const checkAuth = require('../../utils/verify-auth');

module.exports = {
      
    Query:{

        getPosts: async ()=>{
            try {
                const posts = await postModel.find({}).sort({createdAt: -1});
                return posts;
            } catch (error) {
                throw new Error(error)
            }
            
        }, 

        getPost: async (_, { postId })=>{
            try {
                const post = await postModel.findById(postId);
                if(post){
                    return post;
                }else{
                    throw new Error('Post not found')
                }
            } catch (error) {
                throw new Error(error);
            }
        }      
    },
    Mutation: {

        createPost: async (_, { body }, context)=>{
            const user = checkAuth(context);
            const newPost = await postModel.create({ body, username: user.username, user: user.id, createdAt: new Date().toISOString() })
            return newPost;
        },

        deletePost: async (_, { postId }, context)=>{

                const user = checkAuth(context);
                try {
                    const post = await postModel.findById(postId);

                if(!post){
                    throw new UserInputError('Post not found')
                }
                if(post.username===user.username){
                    await post.delete();
                    return 'Post Deleted Successfully'
                }else{
                    throw new AuthenticationError('Action not permitted')
                }

            } catch (error) {
                throw new Error(error)
            }
            
        },

        createComment: async (_, { commentInput }, context)=>{

            const { postId, body } = commentInput;
            const user = checkAuth(context);

            const post = await postModel.findById(postId);

            if(body.trim()===''){
                throw new UserInputError('Comment mustn\'t be empty')
            }
            if(!post){
                throw new UserInputError('Post doesn\'t exist ')
            }else{
                // can use push inplace of unshift but unshift puts the new one at start 
                post.comments.unshift({
                    body,
                    username: user.username,
                    createdAt: new Date().toISOString()
                })
                await post.save();
                return post;
            }
            
        }
    }
}
