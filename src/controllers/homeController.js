const { json } = require('express');
const connection = require('../config/database');
const { getAllUsers, getAllFoodAndDrink, getAllFoodAndDrinkByQuery, getFoodAndDrinkByName, addFoodAndDrink, updateFoodAndDrink, deleteFoodAndDrink, getAllFood, getAllFoodByQuery, getAllDrink, getAllDrinkByQuery, getEmployee, getAllChef, getWaiterByRoomAndDate, getWaiter, getAllCashier, getBestSellerByQuarterAndYear } = require('../services/homeServices');

const getUsers = async (req, res) => {
    let users = await getAllUsers();
    
    return res.send(users);
};

const getFoodAndDrink = async (req, res) => {
    const text = "'";
    const page = req.query.page || 1;
    let search = req.query.search || '';
    const orderBy = req.query.orderBy;
    const orderDir = req.query.orderDir || 'ASC';
    search = text.concat(search,"'");
    
    let menu = await getAllFoodAndDrinkByQuery(page, search, orderBy, orderDir);
    
    if(menu.filtered === 0) {
        req.flash('errMessage', 'Không tìm thấy '+search);
    }

    const numOfResults = menu.total;
    const numOfPages = Math.ceil(numOfResults / 8);
    
    let iterator = (page - 3) < 1 ? 1 : page - 3;
    let endingLink = (iterator + 2) <= numOfPages ? (iterator + 2) : page + (numOfPages - page);
    return res.render('viewFoodAndDrink.ejs', {listMenu: menu.records,
                                               message: req.flash('message'),
                                               errMessage: req.flash('errMessage'),
                                               page: page,
                                               iterator: iterator,
                                               endingLink: endingLink,
                                               numOfPages: numOfPages,
                                               search: search,
                                               orderBy: orderBy,
                                               orderDir: orderDir
                                              });
    
};

const getFoodAndDrinkQuery = async (req, res) => {
    const page = req.query.page;
    const search = req.query.search;
    const orderBy = req.query.orderBy;
    const orderDir = req.query.orderDir;

    let menu = await getAllFoodAndDrinkByQuery(page, search, orderBy, orderDir);
    console.log(menu);
    return res.status(200).json({menu: menu});
}

const getAddPage = async (req, res) => {
    
}

const postAddFoodAndDrink = async (req, res) => {
    const type = (req.body.type === 'Món ăn') ? 'DO AN' : 'DO UONG'; 
    const fdname = (req.body.name === '') ? null : req.body.name;
    const version = (req.body.version === '') ? null : req.body.version;
    const price = (req.body.price === '') ? null : req.body.price;
    const ingredient = req.body.ingredient === '' ? null : req.body.ingredient;
    const description = req.body.description === '' ? null : req.body.description;
    const date = req.body.date === '' ? null : req.body.date;
    const state = req.body.state === '' ? null : req.body.state;
    const origin = (req.body.origin === '') ? null : req.body.origin;
    const recipe = req.body.recipe === '' ? null : req.body.recipe;
    const allergy = req.body.allergy === '' ? null : req.body.allergy;
    
    const result = await addFoodAndDrink(type, fdname, version, price, ingredient, description, date, state, origin, recipe, allergy);
    
    if (result.errCode === 600001) {
        req.flash('errMessage', 'Khác version món ăn!');
    } else if (result.errCode === 60002) {
        req.flash('errMessage', 'Trùng tên món ăn/đồ uống');
    } else if (result.errCode === 60003) {
        req.flash('errMessage', 'Giá không hợp lệ! Vui lòng nhập giá > 0');
    } else if(result.errCode > 60003) {
        req.flash('errMessage', result.errMsg);
    } else {
        req.flash('message', 'Thêm món ăn / đồ uống thành công!');
    }
    return res.redirect('/food-and-drink');
}

const getUpdatePage = async (req, res) => {
    const fdname = req.params.name;

    const fd = await getFoodAndDrinkByName(fdname);
    return res.render('updateFD.ejs', {fd: fd});
}

const postUpdateFoodAndDrink = async (req, res) => {
    const fdname = req.body.name;
    const price = req.body.price === '' ? null : req.body.price;
    const ingredient = req.body.ingredient === '' ? null : req.body.ingredient;
    const origin = req.body.origin === '' ? null : req.body.origin;
    const recipe = req.body.recipe === '' ? null : req.body.recipe;
    
    const result = await updateFoodAndDrink(fdname, price, ingredient, origin, recipe);
    console.log(result);
    if (result.errCode === 60000) {
        req.flash('errMessage', 'Tên món không tồn tại!');
    } else if (result.errCode === 60001) {
        req.flash('errMessage', 'Giá cả không hợp lệ! Vui lòng nhập giá > 0');
    } else {
        req.flash('message', 'Cập nhật món ăn / đồ uống thành công');
    }
    
    return res.redirect('/food-and-drink');
}

const postDeleteFoodAndDrink = async (req, res) => {
    const fdname = req.body.name;

    const result = await deleteFoodAndDrink(fdname);
    console.log(result);

    if (result.errCode === 60000) {
        req.flash('errMessage', 'Tên món không tồn tại!');
    } else {
        req.flash('message', 'Xoá món ăn / đồ uống thành công');
    }
    return res.redirect('/food-and-drink');
}

const getDrink = async (req, res) => {
    const text = "'";
    const page = req.query.page || 1;
    let search = req.query.search || '';
    const orderBy = req.query.orderBy;
    const orderDir = req.query.orderDir || 'ASC';
    search = text.concat(search,"'");

    let menu = await getAllDrinkByQuery(page, search, orderBy, orderDir);
    

    if(menu.filtered === 0) {
        req.flash('errMessage', 'Không tìm thấy '+search);
    }

    const numOfResults = menu.total;
    const numOfPages = Math.ceil(numOfResults / 8);
    let iterator = (page - 2) < 1 ? 1 : page - 2;
    let endingLink = (iterator + 1) <= numOfPages ? (iterator + 1) : page + (numOfPages - page);

    return res.render('viewDrink.ejs', {listMenu: menu.records,
                                        errMessage: req.flash('errMessage'),
                                        page: page,
                                        iterator: iterator,
                                        endingLink: endingLink,
                                        numOfPages: numOfPages,
                                        search: search,
                                        orderBy: orderBy,
                                        orderDir: orderDir});
}

const getFood = async (req, res) => {
    const text = "'";
    const page = req.query.page || 1;
    let search = req.query.search || '';
    const orderBy = req.query.orderBy;
    const orderDir = req.query.orderDir || 'ASC';
    search = text.concat(search,"'");
    

    let menu = await getAllFoodByQuery(page, search, orderBy, orderDir);

    if(menu.filtered === 0) {
        req.flash('errMessage', 'Không tìm thấy '+search);
    }

    const numOfResults = menu.total;
    const numOfPages = Math.ceil(numOfResults / 8);
    let iterator = (page - 2) < 1 ? 1 : page - 2;
    let endingLink = (iterator + 1) <= numOfPages ? (iterator + 1) : page + (numOfPages - page);

    return res.render('viewFood.ejs', {listMenu: menu.records,
                                        errMessage: req.flash('errMessage'),
                                        page: page,
                                        iterator: iterator,
                                        endingLink: endingLink,
                                        numOfPages: numOfPages,
                                        search: search,
                                        orderBy: orderBy,
                                        orderDir: orderDir});
}

const getAllEmployee = async (req, res) => {
    const emp = await getEmployee();
    return res.render('viewAllEmployee.ejs', {emp: emp});
}

const getChef = async (req, res) => {
    const chef = await getAllChef();
    return res.render('viewAllChef.ejs', {emp: chef});
}

const getFindWaiter = async (req, res) => {
    let room = req.query.room;
    let date = req.query.date;

    const allWaiter = await getWaiter();
    if(room === undefined && date === undefined) {
        
        req.flash('errMessage', '');
        
        return res.render('findWaiter.ejs', {emp: allWaiter,
                                          errMessage: req.flash('errMessage')});
    }

    const emp = await getWaiterByRoomAndDate(room, date);

    if(emp === null){
        req.flash('errMessage', 'Không tìm thấy nhân viên');
        return res.render('findWaiter.ejs', {emp: allWaiter,
                                            errMessage: req.flash('errMessage')
                                         });
    }
    return res.render('findWaiter.ejs', {emp: emp,
                                      errMessage: req.flash('errMessage')
                                     });   
}

const getCashier = async (req, res) => {
    const cashier = await getAllCashier()
    return res.render('viewAllCashier.ejs', {emp: cashier});
}

const getBestSellerFood = async (req, res) => {
    const quarter = req.query.quarter;
    const year = req.query.year;
    
    if(quarter === undefined && year === undefined) {
        req.flash('errMessage', '');
        return res.render('bestSellerFood.ejs', {food: [{ TEN: ''}],
                                                 errMessage: req.flash('errMessage')
                                                });
    }

    const food = await getBestSellerByQuarterAndYear(quarter, year);
    if(food === null){
        req.flash('errMessage', 'Không tìm thấy món ăn');
        return res.render('bestsellerFood.ejs', {food: [{ TEN: ''}],
                                                 errMessage: req.flash('errMessage')
                                                });
    }
    return res.render('bestsellerFood.ejs', {food: food,
                                             errMessage: req.flash('errMessage')
                                            });
}

module.exports = {
    getUsers,
    getFoodAndDrink,
    getAddPage,
    postAddFoodAndDrink,
    getUpdatePage,
    postUpdateFoodAndDrink,
    postDeleteFoodAndDrink,
    getFood,
    getDrink,
    getAllEmployee,
    getChef,
    getFindWaiter,
    getCashier,
    getBestSellerFood,
    getFoodAndDrinkQuery
}