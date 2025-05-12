import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User, { IUser } from "@/models/User";
import bcrypt from "bcrypt";

const SECRET_KEY = process.env.AUTH_SECRET || 'default_secret_key';


export async function POST(req: Request){
    const {username, password} = await req.json();
    const user: IUser | null = await User.findOne({name:username});

    if(user){
        return NextResponse.json({error: "User already Exists"}, {status: 409});
    }
    const saltRounds = parseInt(process.env.SALT_ROUNDS || "10", 10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await User.create({name:username, password: hashedPassword});
    const token = jwt.sign({username: newUser.name, role: newUser.role}, SECRET_KEY,{
        expiresIn: "1h",
    });
    return NextResponse.json({token});
}