"use strict";
exports.__esModule = true;
var pdf_table_extractor = require("pdf-table-extractor");
var SPECIAL_SYMBOL = '#';
var NAME_POSITION = 0;
var CODE_POSITION = 1;
var GRADE_POSITION = 2;
var START_POINTS_POSITION = 3;
var mockedSubjectNames = ['Русск. язык', 'Математика', 'Физика', 'Информатика и ИКТ', 'Обществознание', 'История', 'Иностранный язык', 'Биология', 'Литература', 'Творческий конкурс'];
var isCode = function (word) {
    return /\d\d\.\d\d\.\d\d/.test(word);
};
function success(result) {
    var resultTable = [];
    var test = new Set();
    // Первый прогон файла по НЕ закодированному тексту
    result.pageTables.forEach(function (page) {
        page.tables.forEach(function (row) {
            // Т.К. первый прогон парсера будем делать по НЕ раскодированным русским буквам, возьмем необходимую информацию и строк таблицы
            // А именно код направления подготовки и его баллы
            // Во втором прогоне программы мы заполним пробелы
            // Если поле не является табличкой
            if (!isCode(row[CODE_POSITION])) {
                return;
            }
            var points = [];
            for (var column = START_POINTS_POSITION; column <= row.length - 1; column++) {
                // Если поле помечено как экзамен по выбору
                var isOptional = row[column].includes('#');
                // Удаляем символ - метку
                var pointsValue = isOptional ? row[column].replace(SPECIAL_SYMBOL, '') : row[column];
                points.push({
                    value: pointsValue,
                    position: column,
                    isOptional: isOptional,
                    // ИМЕНА НУЖНО БУДЕТ ВЗЯТЬ ТАКЖЕ СО ВТОРОГО ПРОГОНА ПО ХОРОШЕМУ
                    name: mockedSubjectNames[points.length]
                });
            }
            var direction = {
                code: row[CODE_POSITION],
                points: points,
                pageNumber: page.page
            };
            test.add(row[CODE_POSITION]);
            resultTable.push(direction);
        });
    });
    debugger;
    // console.log(JSON.stringify(result));
}
//Error
function error(err) {
    console.error('Error: ' + err);
}
pdf_table_extractor("files/code copy.pdf", success, error);
// 345.91 768.12 -> 335 = start, 335 + 29 = 365
// 375.7 768.12
