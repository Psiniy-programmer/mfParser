import {Direction, Subject, Table} from "./types";

var fs = require('fs');
var pdf_table_extractor = require("pdf-table-extractor");


const SPECIAL_SYMBOL = '#';
const NAME_POSITION = 0;
const CODE_POSITION = 1;
const START_POINTS_POSITION = 2;
const SUBJECTS_COUNT = 10;

const FILE_NAME_ORIGINAL = 'files/code.pdf';
const FILE_NAME_DOWNGRADE = 'files/code copy.pdf';
const mockedSubjectNames = ['Русск. язык', 'Математика', 'Физика', 'Информатика и ИКТ', 'Обществознание', 'История', 'Иностранный язык', 'Биология', 'Литература', 'Творческий конкурс'];

const resultTable: Table = [];

const isCode = (word: string): boolean => {
  return /\d\d\.\d\d\.\d\d/.test(word);
}

function successDowngraded(result) {

  // Первый прогон файла по НЕ закодированному тексту
  result.pageTables.forEach((page) => {
    page.tables.forEach((row) => {
      let curStartPointsPos = START_POINTS_POSITION;
      if (row.every((item) => !item.length)) {
        return;
      }
      let curRow = row[0].split(' ');

      if (isCode(curRow[0]) && !isCode(curRow[1])) {
        const temp = curRow[0];
        curRow[0] = curRow[1];
        curRow[1] = temp;
      }

      if (isNaN(curRow[curStartPointsPos]) && !isNaN(curRow[curStartPointsPos + 1])) {
        curStartPointsPos++;
        // const temp = curRow[START_POINTS_POSITION];
        // curRow[START_POINTS_POSITION] = curRow[START_POINTS_POSITION + 1];
        // curRow[START_POINTS_POSITION + 1] = temp;
      }
      // Т.К. первый прогон парсера будем делать по НЕ раскодированным русским буквам, возьмем необходимую информацию и строк таблицы
      // А именно код направления подготовки и его баллы
      // Во втором прогоне программы мы заполним пробелы

      // Если поле не является табличкой
      if (!isCode(curRow[CODE_POSITION]) && !isCode(curRow[CODE_POSITION - 1])) {
        return;
      }

      const points: Subject[] = [];

      for (let column = curStartPointsPos; column <= curRow.length - 1; column++) {
        // Если поле помечено как экзамен по выбору
        const isOptional: boolean = curRow[column].includes('#');
        // Удаляем символ - метку
        const pointsValue = isOptional ? curRow[column].replace(SPECIAL_SYMBOL, '') : curRow[column];

        if (!mockedSubjectNames[points.length]) {
          continue;
        }

        points.push({
          value: pointsValue,
          isOptional,
          // ИМЕНА НУЖНО БУДЕТ ВЗЯТЬ ТАКЖЕ СО ВТОРОГО ПРОГОНА ПО ХОРОШЕМУ
          name: mockedSubjectNames[points.length]
        })
      }

      const direction: Direction = {
        code: curRow[CODE_POSITION],
        points,
      }

      resultTable.push(direction);
    })
  });
  console.log('result 1', resultTable);
  debugger
}

function successOriginal(result) {

  // Первый прогон файла по НЕ закодированному тексту
  result.pageTables.forEach((page) => {
    page.tables.forEach((row) => {
      if (row.every((item) => !item.length) || !row.some((item) => isCode(item))) {
        return;
      }

      const curRow = row.filter((item) => item.length)[0].split(' ').filter((item) => item.length);
      // Сохраним grade
      const gradePos = curRow.length - SUBJECTS_COUNT - 1;
      const grade = curRow[gradePos];

      // Сохраняем code
      const codePos = gradePos - 1
      const code = curRow[codePos];

      // Сохраним Название специализации (name)
      const specNameLastPos = codePos;
      let specName = '';

      for (let i = 0; i < specNameLastPos; i++) {
        specName += curRow[i].trim() + ' ';
      }

      // ИЩЕМ Ноду, в которой лежат данные с первого прогона по id специализации
      for (let i = 0; i < resultTable.length; i++) {
        const curItemTable = resultTable[i].code;

        if (curItemTable.includes(code)) {
          resultTable[i].grade = grade;
          resultTable[i].name = specName;
          break;
        }
      }
    })
  });
  debugger
  console.log('result 2', resultTable);
}


//Error
function error(err) {
  console.error('Error: ' + err);
}


const main = async () => {
  pdf_table_extractor(FILE_NAME_DOWNGRADE, successDowngraded, error, true, false);
  pdf_table_extractor(FILE_NAME_ORIGINAL, successOriginal, error, false, false);
}

main();
// 345.91 768.12 -> 335 = start, 335 + 29 = 365
// 375.7 768.12
// "g_d0_f4"
// 335 401 29.28 14.06
