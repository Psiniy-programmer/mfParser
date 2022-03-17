import {Direction, Subject, Table} from "./types";

var pdf_table_extractor = require("pdf-table-extractor");

const SPECIAL_SYMBOL = '#';

const NAME_POSITION = 0;
const CODE_POSITION = 1;
const GRADE_POSITION = 2;
const START_POINTS_POSITION = 3;

const mockedSubjectNames = ['Русск. язык', 'Математика', 'Физика', 'Информатика и ИКТ', 'Обществознание', 'История', 'Иностранный язык', 'Биология', 'Литература', 'Творческий конкурс'];

const isCode = (word: string): boolean => {
  return /\d\d\.\d\d\.\d\d/.test(word);
}

function success(result) {

  const resultTable: Table = [];
  const test = new Set();

  // Первый прогон файла по НЕ закодированному тексту
  result.pageTables.forEach((page) => {
    page.tables.forEach((row) => {
      // Т.К. первый прогон парсера будем делать по НЕ раскодированным русским буквам, возьмем необходимую информацию и строк таблицы
      // А именно код направления подготовки и его баллы
      // Во втором прогоне программы мы заполним пробелы

      // Если поле не является табличкой
      if (!isCode(row[CODE_POSITION])) {
        return;
      }

      const points: Subject[] = [];

      for (let column = START_POINTS_POSITION; column <= row.length - 1; column++) {
        // Если поле помечено как экзамен по выбору
        const isOptional: boolean = row[column].includes('#');
        // Удаляем символ - метку
        const pointsValue = isOptional ? row[column].replace(SPECIAL_SYMBOL, '') : row[column];

        points.push({
          value: pointsValue,
          position: column,
          isOptional,
          // ИМЕНА НУЖНО БУДЕТ ВЗЯТЬ ТАКЖЕ СО ВТОРОГО ПРОГОНА ПО ХОРОШЕМУ
          name: mockedSubjectNames[points.length]
        })
      }

      const direction: Direction = {
        code: row[CODE_POSITION],
        points,
        pageNumber: page.page as number
      }

      test.add(row[CODE_POSITION])
      resultTable.push(direction);
    })
  });

  debugger
  // console.log(JSON.stringify(result));
}

//Error
function error(err) {
  console.error('Error: ' + err);
}

pdf_table_extractor("files/code copy.pdf", success, error);
// 345.91 768.12 -> 335 = start, 335 + 29 = 365
// 375.7 768.12
