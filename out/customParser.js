"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var fs = require('fs');
var pdf_table_extractor = require("pdf-table-extractor");
var SPECIAL_SYMBOL = '#';
var NAME_POSITION = 0;
var CODE_POSITION = 1;
var START_POINTS_POSITION = 2;
var SUBJECTS_COUNT = 10;
var FILE_NAME_ORIGINAL = 'files/code.pdf';
var FILE_NAME_DOWNGRADE = 'files/code copy.pdf';
var mockedSubjectNames = ['Русск. язык', 'Математика', 'Физика', 'Информатика и ИКТ', 'Обществознание', 'История', 'Иностранный язык', 'Биология', 'Литература', 'Творческий конкурс'];
var resultTable = [];
var isCode = function (word) {
    return /\d\d\.\d\d\.\d\d/.test(word);
};
function successDowngraded(result) {
    // Первый прогон файла по НЕ закодированному тексту
    result.pageTables.forEach(function (page) {
        page.tables.forEach(function (row) {
            if (row.every(function (item) { return !item.length; })) {
                return;
            }
            var curRow = row[0].split(' ');
            if (isCode(curRow[0]) && !isCode(curRow[1])) {
                var temp = curRow[0];
                curRow[0] = curRow[1];
                curRow[1] = temp;
            }
            if (isNaN(curRow[START_POINTS_POSITION]) && !isNaN(curRow[START_POINTS_POSITION + 1])) {
                var temp = curRow[START_POINTS_POSITION];
                curRow[START_POINTS_POSITION] = curRow[START_POINTS_POSITION + 1];
                curRow[START_POINTS_POSITION + 1] = temp;
            }
            // Т.К. первый прогон парсера будем делать по НЕ раскодированным русским буквам, возьмем необходимую информацию и строк таблицы
            // А именно код направления подготовки и его баллы
            // Во втором прогоне программы мы заполним пробелы
            // Если поле не является табличкой
            if (!isCode(curRow[CODE_POSITION])) {
                return;
            }
            var points = [];
            debugger;
            for (var column = START_POINTS_POSITION; column <= curRow.length - 1; column++) {
                // Если поле помечено как экзамен по выбору
                var isOptional = curRow[column].includes('#');
                // Удаляем символ - метку
                var pointsValue = isOptional ? curRow[column].replace(SPECIAL_SYMBOL, '') : curRow[column];
                if (!mockedSubjectNames[points.length]) {
                    continue;
                }
                points.push({
                    value: pointsValue,
                    isOptional: isOptional,
                    // ИМЕНА НУЖНО БУДЕТ ВЗЯТЬ ТАКЖЕ СО ВТОРОГО ПРОГОНА ПО ХОРОШЕМУ
                    name: mockedSubjectNames[points.length]
                });
            }
            var direction = {
                code: curRow[CODE_POSITION],
                points: points
            };
            resultTable.push(direction);
        });
    });
    console.log('result 1', resultTable);
}
function successOriginal(result) {
    // Первый прогон файла по НЕ закодированному тексту
    result.pageTables.forEach(function (page) {
        page.tables.forEach(function (row) {
            if (row.every(function (item) { return !item.length; }) || !row.some(function (item) { return isCode(item); })) {
                return;
            }
            var curRow = row.filter(function (item) { return item.length; })[0].split(' ').filter(function (item) { return item.length; });
            // Сохраним grade
            var gradePos = curRow.length - SUBJECTS_COUNT - 1;
            var grade = curRow[gradePos];
            // Сохраняем code
            var codePos = gradePos - 1;
            var code = curRow[codePos];
            // Сохраним Название специализации (name)
            var specNameLastPos = codePos;
            var specName = '';
            for (var i = 0; i < specNameLastPos; i++) {
                specName += curRow[i].trim() + ' ';
            }
            // ИЩЕМ Ноду, в которой лежат данные с первого прогона по id специализации
            for (var i = 0; i < resultTable.length; i++) {
                var curItemTable = resultTable[i].code;
                if (curItemTable.includes(code)) {
                    resultTable[i].grade = grade;
                    resultTable[i].name = specName;
                    break;
                }
            }
        });
    });
    // debugger;
    console.log('result 2', resultTable);
}
//Error
function error(err) {
    console.error('Error: ' + err);
}
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        pdf_table_extractor(FILE_NAME_DOWNGRADE, successDowngraded, error, true, false);
        pdf_table_extractor(FILE_NAME_ORIGINAL, successOriginal, error, false, false);
        return [2 /*return*/];
    });
}); };
main();
// 345.91 768.12 -> 335 = start, 335 + 29 = 365
// 375.7 768.12
// "g_d0_f4"
// 335 401 29.28 14.06
