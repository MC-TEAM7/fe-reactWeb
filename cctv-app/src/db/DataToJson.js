// data_ex.csv가져와서 데이터프레임으로 변경
const fs = require('fs');
const csv = require('csv-parser');
const iconv = require('iconv-lite');
const { DataFrame } = require('dataframe-js');

const data = fs.readFileSync('./data_ex.csv');
const data_utf8 = iconv.decode(data, 'euc-kr').toString();

