SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--2.1.a
ALTER PROC [dbo].[proc_insert_food_and_drink]
    @LOAI VARCHAR(100) = NULL,
    @TEN VARCHAR(100) = NULL,
    @VERSION INT = NULL,
    @GIA BIGINT = NULL,
    @NGUYENLIEU VARCHAR(100) = NULL,
    @MOTA VARCHAR(100) = NULL,
    @NGAYTHEM DATE = NULL,
    @TINHTRANG VARCHAR(100) = NULL,
    @XUATXU VARCHAR(100) = NULL,
    @CACHCHEBIEN VARCHAR(100) = NULL,
    @CANHBAODIUNG VARCHAR(100) = NULL
AS
BEGIN
    DECLARE @NULLCOLUMN TABLE(COLUMNNAME VARCHAR(100))
    DECLARE @REDUNCOLUMN TABLE(SPARENAME VARCHAR(100))
    DECLARE @MISSINGCOLUMN VARCHAR(100)
    DECLARE @SPARECOLUMN VARCHAR(100)
    IF(@TEN IS NULL) INSERT INTO @NULLCOLUMN
    VALUES('cot TEN')
    IF(@VERSION IS NULL) INSERT INTO @NULLCOLUMN
    VALUES('cot VERSION')
    IF(@GIA IS NULL) INSERT INTO @NULLCOLUMN
    VALUES('cot GIA')
    IF(EXISTS(SELECT 1
    FROM @NULLCOLUMN))
    BEGIN
        SELECT @MISSINGCOLUMN = STRING_AGG(COLUMNNAME,',')
        FROM @NULLCOLUMN;
        EXEC sys.sp_addmessage  
        @msgnum   = 60000  
        ,@severity = 16  
        ,@msgtext  = N'Chua nhap du lieu o (%s).'  
        ,@lang = 'us_english'
        ,@with_log = 'FALSE'
        ,@replace = 'replace';
  
        DECLARE @msg NVARCHAR(2048) = FORMATMESSAGE(60000, @MISSINGCOLUMN);   
  
        THROW 60000, @msg, 1;
    END
    IF(EXISTS(SELECT 1
    FROM FOODANDDRINK
    WHERE @VERSION != VERSION))
    BEGIN
        ;THROW 60001, 'Khac version mon an', 1;
    END
    IF EXISTS(SELECT 1
    FROM FOODANDDRINK
    WHERE @TEN = TEN )
    BEGIN
        ;THROW 60002, 'Trung ten mon an', 1;
    END
    IF @GIA <=0
    BEGIN
        ;THROW 60003, 'Gia nhap khong hop le', 1;
    END
    IF @LOAI = 'DO AN'
    BEGIN
        IF(@NGUYENLIEU IS NULL) INSERT INTO @NULLCOLUMN
        VALUES('cot NGUYENLIEU')
        IF(@MOTA IS NULL) INSERT INTO @NULLCOLUMN
        VALUES('cot MOTA')
        IF(@NGAYTHEM IS NULL) INSERT INTO @NULLCOLUMN
        VALUES('cot NGAYTHEM')
        IF(@TINHTRANG IS NULL) INSERT INTO @NULLCOLUMN
        VALUES('cot TINHTRANG')
        IF(@CACHCHEBIEN IS NULL) INSERT INTO @NULLCOLUMN
        VALUES('cot CACHCHEBIEN')
        IF(@CANHBAODIUNG IS NULL) INSERT INTO @NULLCOLUMN
        VALUES('cot CANHBAODIUNG')
        IF(EXISTS(SELECT 1
        FROM @NULLCOLUMN))
        BEGIN
            SELECT @MISSINGCOLUMN = STRING_AGG(COLUMNNAME,',')
            FROM @NULLCOLUMN
            EXEC sys.sp_addmessage  
            @msgnum   = 60004
            ,@severity = 16  
            ,@msgtext  = N'Chua nhap du lieu o (%s).'  
            ,@lang = 'us_english'
            ,@with_log = 'FALSE'
            ,@replace = 'replace';
    
            DECLARE @msg1 NVARCHAR(2048) = FORMATMESSAGE(60004, @MISSINGCOLUMN);   
    
            THROW 60004, @msg1, 1;
        END
        IF(@XUATXU IS NOT NULL) 
        BEGIN
            ;THROW 60005, 'Ban khong duoc nhap cot XUATXU', 1;
        END
        ELSE 
        BEGIN
            INSERT INTO FOODANDDRINK
                (TEN,VERSION,GIA,NGUYENLIEU,MOTA,NGAYTHEM,TINHTRANG)
            VALUES(@TEN, @VERSION, @GIA, @NGUYENLIEU, @MOTA, @NGAYTHEM, @TINHTRANG)
            INSERT INTO MON_AN
                (TEN,VERSION,CACHCHEBIEN,CANHBAODIUNG)
            VALUES(@TEN, @VERSION, @CACHCHEBIEN, @CANHBAODIUNG)
        END
    END
    ELSE IF @LOAI = 'DO UONG'
    BEGIN
        IF(@CACHCHEBIEN IS NOT NULL) INSERT INTO @REDUNCOLUMN
        VALUES('cot CACHCHEBIEN')
        IF(@CANHBAODIUNG IS NOT NULL) INSERT INTO @REDUNCOLUMN
        VALUES('cot CANHBAODIUNG')
        IF(EXISTS(SELECT 1
        FROM @REDUNCOLUMN))
        BEGIN
            SELECT @SPARECOLUMN = STRING_AGG(SPARENAME,',')
            FROM @REDUNCOLUMN
            EXEC sys.sp_addmessage  
            @msgnum   = 60006
            ,@severity = 16  
            ,@msgtext  = N'Ban khong duoc nhap (%s).'  
            ,@lang = 'us_english'
            ,@with_log = 'FALSE'
            ,@replace = 'replace';
    
            DECLARE @msg2 NVARCHAR(2048) = FORMATMESSAGE(60006, @SPARECOLUMN);   
  
            THROW 60006, @msg2, 1;
        END
        IF(@NGUYENLIEU IS NULL) INSERT INTO @NULLCOLUMN
        VALUES('cot NGUYENLIEU')
        IF(@MOTA IS NULL) INSERT INTO @NULLCOLUMN
        VALUES('cot MOTA')
        IF(@NGAYTHEM IS NULL) INSERT INTO @NULLCOLUMN
        VALUES('cot NGAYTHEM')
        IF(@TINHTRANG IS NULL) INSERT INTO @NULLCOLUMN
        VALUES('cot TINHTRANG')
        IF(@XUATXU IS NULL) INSERT INTO @NULLCOLUMN
        VALUES('cot XUATXU')
        IF(EXISTS(SELECT 1
        FROM @NULLCOLUMN))
        
        BEGIN
            SELECT @MISSINGCOLUMN = STRING_AGG(COLUMNNAME,',')
            FROM @NULLCOLUMN
            EXEC sys.sp_addmessage  
            @msgnum   = 60007
            ,@severity = 16  
            ,@msgtext  = N'Chua nhap du lieu o (%s).'  
            ,@lang = 'us_english'
            ,@with_log = 'FALSE'
            ,@replace = 'replace';
    
            DECLARE @msg3 NVARCHAR(2048) = FORMATMESSAGE(60007, @MISSINGCOLUMN);
            THROW 60007, @msg3, 1;
        END
        ELSE
        BEGIN
            INSERT INTO FOODANDDRINK
                (TEN,VERSION,GIA,NGUYENLIEU,MOTA,NGAYTHEM,TINHTRANG)
            VALUES(@TEN, @VERSION, @GIA, @NGUYENLIEU, @MOTA, @NGAYTHEM, @TINHTRANG)
            INSERT INTO DO_UONG
                (TEN,VERSION,XUATXU)
            VALUES(@TEN, @VERSION, @XUATXU)
        END
    END
END

--2.1.b
ALTER PROC [dbo].[proc_update_food_and_drink]
    @TEN VARCHAR(100) = NULL,
    @GIA BIGINT = NULL,
    @NGUYENLIEU VARCHAR(100) = NULL,
    @CACHCHEBIEN VARCHAR(100) = NULL,
    @XUATXU VARCHAR(100) = NULL
AS
BEGIN
    IF(NOT EXISTS(SELECT *
    FROM FOODANDDRINK
    WHERE @TEN = TEN))
    BEGIN
        ;THROW 60000, 'Ten mon khong ton tai!', 1;
    END
    IF @GIA <= 0
    BEGIN
        ;THROW 60001, 'Gia ca khong hop le!', 1;
    END
    ELSE 
    BEGIN
        DECLARE @GIAFD BIGINT
        SELECT @GIAFD = GIA
        FROM FOODANDDRINK
        WHERE @TEN = TEN
        IF(@GIAFD<>@GIA)
        BEGIN
            UPDATE FOODANDDRINK
            SET GIA = @GIA,NGUYENLIEU = @NGUYENLIEU
            WHERE @TEN = TEN
            UPDATE MON_AN
            SET CACHCHEBIEN = @CACHCHEBIEN
            WHERE @TEN = TEN
            UPDATE DO_UONG
            SET XUATXU = @XUATXU
            WHERE @TEN = TEN
        END
        ELSE 
        BEGIN
            UPDATE FOODANDDRINK
            SET NGUYENLIEU = @NGUYENLIEU
            WHERE @TEN = TEN
            UPDATE MON_AN
            SET CACHCHEBIEN = @CACHCHEBIEN
            WHERE @TEN = TEN
            UPDATE DO_UONG
            SET XUATXU = @XUATXU
            WHERE @TEN = TEN
        END
    END
END

--2.1.c
ALTER PROC [dbo].[proc_delete_food_and_drink]
    @TEN VARCHAR(100) = NULL
AS
BEGIN
    IF(NOT EXISTS(SELECT *
    FROM FOODANDDRINK
    WHERE @TEN = TEN))
    BEGIN
        ;THROW 60000, 'Mon nay khong ton tai', 1;
    END
    IF(NOT EXISTS(SELECT DISTINCT TEN
    FROM HOADON HD
        JOIN DONHANG_FD DH
        ON HD.MADONHANG = DH.MDH
    WHERE @TEN = TEN))
    BEGIN
        IF(NOT EXISTS(SELECT DISTINCT TEN
        FROM DO_UONG
        WHERE @TEN = TEN))
        BEGIN
            DELETE FROM MON_AN
            WHERE @TEN = TEN
        END
        ELSE
        BEGIN
            DELETE FROM DO_UONG
            WHERE @TEN = TEN
        END
        DELETE FROM FOODANDDRINK
        WHERE @TEN = TEN
    END
    ELSE
    BEGIN
        UPDATE FOODANDDRINK
        SET TINHTRANG = 'Khong ban'
        WHERE @TEN = TEN
    END
END
GO
