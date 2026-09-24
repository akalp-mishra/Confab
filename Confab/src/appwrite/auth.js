import {Client, Account, ID, TablesDB, Databases} from "appwrite";
import conf from "../conf.js";

export class AuthService {
    Client =new Client();
    databases;
    account;
    tableDB;

    constructor(){
        this.Client.setEndpoint(conf.endpoint).setProject(conf.projectId);
        this.databases = new Databases(this.Client);
        this.account = new Account(this.Client);
        this.tableDB = new TablesDB(this.Client);
    }

    async createAccount({email, password, name}){
        try {
            const userAccount =await this.account.create({userId:ID.unique(),email:email,password:password,name:name});
            if(userAccount){
                return userAccount;
            }
            else {
                console.log("Some error occured.");
            }
        }
        catch (error){
            if (error.code === 409) {
                console.error("Signup failed: This email address is already registered.");
                alert("An account with this email already exists. Please log in instead.");
        } else {
            console.error("An unexpected error occurred:", error.message);
        }
        }
    }

    async addAccount({$id, email ,name, pfp}){
        try{
            return await this.tableDB.createRow({
                databaseId : conf.databaseId, 
                tableId : conf.userTableId, 
                rowId : ID.unique(),
                data:{
                    userId : $id, 
                    userMail : email, 
                    userName : name,
                    profileImage : pfp
                }
            })
        }
        catch(error){
            console.log(error);
        }
    }

    async login({email,password}){
        try {
            const result = await this.account.createEmailPasswordSession({
                email: email,
                password: password
            });
            return result;
        }
        catch (error){
            console.log(error);
        }
    }

    async getCurrentUser(){
        try{
            const user = await this.account.get();
            return user;
        }
        catch (error){
            console.log(error);
        }
    }

    async logout(){
        try{
            const result = await this.account.deleteSessions().then();
            return result;
        }
        catch (error){
            throw error;
        }
    }
}

const AuthServiceObj= new AuthService();

export default AuthServiceObj;
