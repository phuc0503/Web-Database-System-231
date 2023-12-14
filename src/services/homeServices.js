// const connection = require('../config/database');
const config = require('../config/databaseNew');
const sql = require('mssql');


const getAllUsers = async () => {
    let pool;
    try {
        pool = await sql.connect(config)
        const { recordset } = await sql.query('select * from KHACHHANG');
        return recordset;
    } catch (err) {
        // ... error checks
        console.log(err);
    } finally {
        pool.close();
    }
}

const resultsPerPage = 10;

const getAllFoodAndDrink = async (req, res) => {
    let pool;
    try {
        pool = await sql.connect(config);
        const { recordset } = await sql.query('select * from FOODANDDRINK');
        console.log(recordset);
        return recordset;
    } catch (err) {
        // ... error checks
        console.log(err);
    } finally {
        pool.close();
    }
}

const getAllFoodAndDrinkByQuery = async (page, search, orderBy, orderDir) => {
    let pool;
    try {
        pool = await sql.connect(config);
        let result = await pool.request()
            .input('page', sql.Int, page || 1)
            .input('size', sql.Int, 8)
            .input('search', sql.VarChar(100), search || '')
            .input('orderBy', sql.VarChar(100), orderBy || 'TEN')
            .input('orderDir', sql.VarChar(100), orderDir || 'ASC')
            .execute('proc_fd_pagination');
        const count = result.recordsets[1][0];
        const foodanddrink = { 
            records: result.recordsets[0],
            filtered: count.Filtered,
            total: count.Total,
        };
        return foodanddrink;
    } catch (error) {   
        console.log(error);
    } finally {
        pool.close();
    }
}

const getFoodAndDrinkByName = async (fdname) => {
    let pool;
    try {
        pool = await sql.connect(config);
        const { recordset } = await sql.query`elect * from FOODANDDRINK where TEN = ${fdname}`;
        return recordset;
    } catch (err) {
        // ... error checks
        console.log(err);
    } finally {
        pool.close();
    }
}


const addFoodAndDrink = async (type, fdname, version, price, ingredient, description, date, state, origin, recipe, allergy) => {
    let pool;
    try {
        const today = new Date().toISOString();
        pool = await sql.connect(config);
        let result = await pool.request()
            .input('LOAI', sql.VarChar(100), type)
            .input('TEN', sql.VarChar(100), fdname)
            .input('VERSION', sql.Int, version)
            .input('GIA', sql.BigInt, price)
            .input('NGUYENLIEU', sql.VarChar(100), ingredient)
            .input('MOTA', sql.VarChar(100), description)
            .input('NGAYTHEM', sql.Date, today)
            .input('TINHTRANG', sql.VarChar(100), state)
            .input('XUATXU', sql.VarChar(100), origin)
            .input('CACHCHEBIEN', sql.VarChar(100), recipe)
            .input('CANHBAODIUNG', sql.VarChar(100), allergy)
            .execute('proc_insert_food_and_drink')
        
        
        return {errCode: 0, errMsg: 'Add food/drink successfully!'};
    } catch (err) {
    console.log({
        errCode: err.number,
        errMsg: err.message});
    return {errCode: err.number, errMsg: err.message};
    } finally {
        pool.close();
    }
}

const updateFoodAndDrink = async (fdname, price, ingredient, origin, recipe ) => {
    let pool;
    try {
        pool = await sql.connect(config);
        let result = await pool.request()
            .input('TEN', sql.VarChar(100), fdname)
            .input('GIA', sql.BigInt, price)
            .input('NGUYENLIEU', sql.VarChar(100), ingredient)
            .input('XUATXU', sql.VarChar(100), origin)
            .input('CACHCHEBIEN', sql.VarChar(100), recipe)
            .execute('proc_update_food_and_drink')
        
        console.dir(result);
        return {errCode: 0, errMsg: 'Update food/drink successfully!'};
    } catch (err) {
        console.log({
            errCode: err.number,
            errMsg: err.message});
        return {errCode: err.number, errMsg: err.message};
    } finally {
        pool.close();
    }
}

const deleteFoodAndDrink = async (fdname) => {
    let pool;
    try {
        pool = await sql.connect(config);
        let result = await pool.request()
            .input('TEN', sql.VarChar(100), fdname)
            .execute('proc_delete_food_and_drink')
        
        console.dir(result);
        return {errCode: 0, errMsg: 'Delete food/drink successfully!'};
    } catch (err) {
        console.log({
            errCode: err.number,
            errMsg: err.message});
        return {errCode: err.number, errMsg: err.message};
    } finally {
        pool.close();
    }
}

const getAllFood = async () => {
    let pool;
    try {
        pool = await sql.connect(config)
        const { recordset } = await sql.query('select * from MON_AN');
        return recordset;
        // return result;
    } catch (err) {
        // ... error checks
        console.log(err);
    } finally {
        pool.close();
    }
}

const getAllFoodByQuery = async (page, search, orderBy, orderDir) => {
    let pool;
    try {
        pool = await sql.connect(config);
        let result = await pool.request()
            .input('page', sql.Int, page || 1)
            .input('size', sql.Int, 8)
            .input('search', sql.VarChar(100), search || '')
            .input('orderBy', sql.VarChar(100), orderBy || 'TEN')
            .input('orderDir', sql.VarChar(100), orderDir || 'ASC')
            .execute('proc_food_pagination');
        const count = result.recordsets[1][0];
        const food = { 
            records: result.recordsets[0],
            filtered: count.Filtered,
            total: count.Total,
        };
        // console.log(foodanddrink);
        return food;
    } catch (error) {   
        console.log(error);
    } finally {
        pool.close();
    }
}

const getAllDrink = async () => {
    let pool;
    try {
        pool = await sql.connect(config)
        const { recordset } = await sql.query('select * from DO_UONG');
        return recordset;
        // return result;
    } catch (err) {
        // ... error checks
        console.log(err);
    } finally {
        pool.close();
    }
}

const getAllDrinkByQuery = async (page, search, orderBy, orderDir) => {
    let pool;
    try {
        pool = await sql.connect(config);
        let result = await pool.request()
            .input('page', sql.Int, page || 1)
            .input('size', sql.Int, 8)
            .input('search', sql.VarChar(100), search || '')
            .input('orderBy', sql.VarChar(100), orderBy || 'TEN')
            .input('orderDir', sql.VarChar(100), orderDir || 'ASC')
            .execute('proc_drink_pagination');
        const count = result.recordsets[1][0];
        const drink = { 
            records: result.recordsets[0],
            filtered: count.Filtered,
            total: count.Total,
        };
        // console.log(foodanddrink);
        return drink;
    } catch (error) {   
        console.log(error);
    } finally {
        pool.close();
    }
}

const getEmployee = async () => {
    let pool;
    try {
        pool = await sql.connect(config);
        const { recordset } = await sql.query('SELECT * FROM NHANVIEN');
        return recordset;
    } catch (error) {
        console.log(error);
    } finally {
        pool.close();
    }
}

const getAllChef = async () => {
    let pool;
    try {
        pool = await sql.connect(config);
        const { recordset } = await sql.query('SELECT DAUBEP.MANHANVIEN, HOTEN, GIOITINH, NGAYSINH, DIACHI, NGAYBATDAULAM, TKNGANHANG, BANGCAP, LUONGTHEOTHANG, LUONGTHEOGIO, MANVQUANLY FROM DAUBEP JOIN NHANVIEN ON DAUBEP.MANHANVIEN = NHANVIEN.MANHANVIEN');

        return recordset;
    } catch (error) {
        console.log(error);
    } finally {
        pool.close();
    }
}

const getWaiter = async () => {
    let pool;
    try {
        pool = await sql.connect(config)

        const { recordset } = await sql.query('SELECT PHUCVU.MANHANVIEN, HOTEN, GIOITINH, NGAYSINH, DIACHI, NGAYBATDAULAM, TKNGANHANG, BANGCAP, LUONGTHEOTHANG, LUONGTHEOGIO, MANVQUANLY FROM PHUCVU JOIN NHANVIEN ON PHUCVU.MANHANVIEN = NHANVIEN.MANHANVIEN');

        return recordset;
    } catch (error) {
        console.log(error);
    } finally {
        pool.close();
    }
}

const getWaiterByRoomAndDate = async (room, date) => {
    let pool;
    try {
        pool = await sql.connect(config);
        const { recordset, rowsAffected } = await pool.request()
            .input('SOPHONG', sql.VarChar(100), room)
            .input('NGAYPHUCVU', sql.Date, date)
            .execute('proc_list_employee_of_room');
        if(rowsAffected > 0){
            return recordset;
        } else {
            return null;
        }
        
    } catch (err) {
        console.log(err);
    } finally {
        pool.close();
    }
}

const getAllCashier = async () => {
    let pool;
    try {
        pool = await sql.connect(config);
        const { recordset } = await sql.query('SELECT THUNGAN.MANHANVIEN, HOTEN, GIOITINH, NGAYSINH, DIACHI, NGAYBATDAULAM, TKNGANHANG, BANGCAP, LUONGTHEOTHANG, LUONGTHEOGIO, MANVQUANLY FROM THUNGAN JOIN NHANVIEN ON THUNGAN.MANHANVIEN = NHANVIEN.MANHANVIEN');

        return recordset;
    } catch (error) {
        console.log(error);
    } finally {
        pool.close();
    }
}

const getBestSellerByQuarterAndYear = async (quarter, year) => {
    let pool;
    try {
        pool = await sql.connect(config);
        const { recordset, rowsAffected } = await pool.request()
            .input('QUY', sql.Int, quarter)
            .input('NAM', sql.Int, year)
            .execute('proc_bestseller_food');
        if(rowsAffected > 0){
            return recordset;
        } else {
            return null;
        }
        
    } catch (err) {
        console.log(err);
    } finally {
        pool.close();
    }
}

module.exports = {
    getAllUsers,
    getAllFoodAndDrink,
    getAllFoodAndDrinkByQuery,
    getFoodAndDrinkByName,
    addFoodAndDrink,
    updateFoodAndDrink,
    deleteFoodAndDrink,
    getAllFood,
    getAllFoodByQuery,
    getAllDrinkByQuery,
    getAllDrink,
    getEmployee,
    getAllChef,
    getWaiterByRoomAndDate,
    getAllCashier,
    getWaiter,
    getBestSellerByQuarterAndYear
}