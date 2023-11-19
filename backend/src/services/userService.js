import db from "../models/index"
import bcrypt from 'bcryptjs';
// const db = require("../models/index");
// const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync();
let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};

            let isExist = await checkUserEmail(email);
            if (isExist) {
                //user already exist

                let user = await db.User.findOne({
                    attributes: ['email', 'roleId', 'password', 'firstName', 'lastName'],
                    where: { email: email },
                    raw: true
                });
                if (user) {
                    //compare password
                    let check = await bcrypt.compareSync(password, user.password);
                    //let check = true;
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'Ok';
                        delete user.password;
                        userData.user = user;
                        // userData.errorCode = 3;
                        // userData.errMessage = 'Wrong Password';
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong Password';
                        //userData.errorCode = 0;
                        // userData.errMessage = 'Ok',
                        //     userData.user = user;
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `User's not found`
                }


            } else {
                //return error
                userData.errCode = 1;
                userData.errMessage = `Your's Email isn't exist in your system. Plz try other email!`

            }
            resolve(userData);
        } catch (e) {
            reject(e)
        }
    })
}


let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail }
            })
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (e) {
            reject(e);
        }
    })
}
let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e.message);
        }
    })
}
let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.roleId || !data.positionId || !data.gender) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameter'
                })
            }

            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            })
            if (user) {

                // email: data.email,
                //     password: hashPasswordFormBcrypt,
                //     firstName: data.firstName,
                //     lastName: data.lastName,
                //     address: data.address,
                //     phonenumber: data.phonenumber,
                //     gender: data.gender,
                //     roleId: data.roleId,
                //     positionId: data.positionId,
                //     image: data.image
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.roleId = data.roleId;
                user.positionId = data.positionId;
                user.gender = data.gender;
                user.phonenumber = data.phonenumber;
                //user.phonenumber = data.phoneNumber;
                if (data.avatar) {
                    user.image = data.avatar;
                }
                await user.save();
            }
            resolve({
                errCode: 0,
                errMessage: 'Update the user successfully'
            });
        } catch (e) {
            reject({
                errCode: 1,
                errMessage: 'User not found'
            });
        }
    })
}
let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                });

            }
            if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(users);
        }
        catch (e) {
            reject(e)
        }
    })
}
let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //check email does not exist
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: `Your's Email is already exist in your system. Plz try other email!`
                })
            } else {
                let hashPasswordFormBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFormBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phonenumber: data.phonenumber,
                    gender: data.gender,
                    roleId: data.roleId,
                    positionId: data.positionId,
                    image: data.avatar
                    //image: data.image
                })
            }


            resolve({
                errCode: 0,
                message: 'OK'
            })
        } catch (e) {
            reject(e)
        }
    })
}
let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        let foundUser = await db.User.findOne({
            where: { id: userId }
        })
        if (!foundUser) {
            resolve({
                errCode: 2,
                errMessage: `the user isn't exist`
            })
        }

        await db.User.destroy({
            where: { id: userId }
        })

        resolve({
            errCode: 0,
            errMessage: 'The user is deleted'
        })
    })
}
let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing Parameter"
                });
            } else {
                let res = {};
                let Allcode = await db.Allcode.findAll({
                    where: { type: typeInput }
                });
                res.errCode = 0;
                res.data = Allcode;
                resolve(res);
            }
        } catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserData: updateUserData,
    getAllCodeService: getAllCodeService
}