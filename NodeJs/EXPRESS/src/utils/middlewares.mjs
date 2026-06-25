import {users} from "./constants.mjs"

export const getUserIndexById=(req,res,next)=>{
    const id=parseInt(req.params.id);

    const userIndex=users.findIndex((user)=>user.id === id);
    if(userIndex===-1){
        return res.send({msg:"user not found"});
    }
    req.userIndex=userIndex;
    next();
}