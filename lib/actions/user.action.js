"use server";

import { revalidatePath } from "next/cache";

import User from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose";


// This are Nothing But CRUD Operations

// CREATE
export async function createUser(user) {
  try {
    await connectToDatabase();

    const newUser = await User.create(user);
    return JSON.parse(JSON.stringify(newUser));
    console.log("new user created")
  } catch (error) {
    console.log(error.message);
    throw new Error(`Error :${error}`);
  }
}

// READ
export async function getUserById(userId) {
  try {
    await connectToDatabase();

    const user = await User.findOne({ clerkId: userId });

    if (!user) throw new Error("User not found");

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.log(error.message);
    throw new Error(`Error :${error}`);
  }
}

// UPDATE
export async function updateUser(clerkId, user) {
  try {
    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });

    if (!updatedUser) throw new Error("User update failed");
    
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    console.log(error.message);
    throw new Error(`Error :${error}`);
  }
}

// DELETE
export async function deleteUser(clerkId) {
  try {
    await connectToDatabase();

    // Find user to delete
    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      throw new Error("User not found");
    }

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    console.log(error.message);
    throw new Error(`Error :${error}`);
  }
}

// Use Credits

export async function updateCredits(userId,creditFee){
  try{

    const updatedUserCredits=await User.findOneAndUpdate(
      {_id:userId},
    {$inc:{credits:creditFee}},
    {new:true}
  )
    if(!updatedUserCredits) throw new Error("User credits update failed");

    return JSON.parse(JSON.stringify(updatedUserCredits));


  }catch(error){
    console.log(error.message);
    throw new Error(`Error :${error}`);
  }
}
