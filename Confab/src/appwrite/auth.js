import {Client, Account, ID} from "appwrite";
import conf from "../conf.js";

export class AuthService {
    Client =new Client();
    account;

    constructor(){
        this.Client.setEndpoint(conf.endpoint).setProject(conf.projectId);
        this.account = new Account(this.Client);
    }

    async createAccount({email, password, name}){
        try {
            const userAccount =await this.account.create(ID.unique(),email,password,name);
            await this.account.createEmailPasswordSession(email,password)
            if(userAccount){
                return userAccount;
                console.log(`Account ${userAccount.$id} created successfully`);
                return this.login(email, password);
            }
            else {
                return userAccount;
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
