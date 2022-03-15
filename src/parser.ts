import {Direction, Subject} from "./types";

const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('file.pdf');

const SUBJECT_COUNT = 10;
const START_TABLE = 'шкале';

const isCode = (word: string): boolean => {
  return /\d\d\.\d\d\.\d\d/.test(word);
}

const replaceEverySymbol = (word: string, target: any, res: any) => {
  return word.split('').map((letter) => letter === target ? res : letter).join('')
}

const getIsCapitalLetter = (word: string) => {
  return /[А-Я]/.test(word.charAt(0))
}

const isEveryLetterCapital = (word: string) => {
  return word.split('').every((item) => /[А-Я]/.test(item))
}

const getNextWordIndex = (content: any, curStep: number): number => {
  let newStep = curStep + 1;
  while (!content[newStep].str.trim().length) {
    newStep++;
  }

  return newStep;
}

const parseDirection = (content: any, curStep: number, subjects: Subject[], isSaveInFile = false): number => {
  let countOfSetSubjects = 0
  let nextStep = curStep;
  let curStr = content[curStep].str;
  let directionPoints: Subject[] = subjects;
  let directionName = '';
  let directionCode = '';
  let directionGrade = '';
  let tempSubjPoints = '';

  while (!isCode(curStr)) {
    directionName += curStr;
    curStep++;
    curStr = content[curStep].str;
  }
  // save code
  directionCode = content[curStep].str;
  curStep++;
  // save grade
  curStep = getNextWordIndex(content, curStep);
  directionGrade = content[curStep].str;
  curStep++;
  // save points
  while (countOfSetSubjects !== subjects.length) {
    curStep = getNextWordIndex(content, curStep);
    curStr = content[curStep].str;
    tempSubjPoints += curStr;
    // if points on different lines, need to get them from next line
    if (!isNaN(curStr) && curStr.length === 1) {
      curStep = getNextWordIndex(content, curStep);
      curStr = content[curStep].str;
      tempSubjPoints += curStr;
    }
    directionPoints[countOfSetSubjects].value = isNaN(Number(tempSubjPoints)) ? null : Number(tempSubjPoints);

    tempSubjPoints = '';
    countOfSetSubjects++;
  }

  const direction: Direction = {
    name: directionName,
    code: directionCode,
    grade: directionGrade,
    points: directionPoints
  }
  nextStep = curStep;

  if (isSaveInFile) {
    fs.appendFile('json', JSON.stringify(direction), ((err: any) => console.error(err)));
  }

  return nextStep;
}

function render_page(pageData: {
  getTextContent: (arg0: {
    //replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
    normalizeWhitespace: boolean;
    //do not attempt to combine same line TextItem's. The default value is `false`.
    disableCombineTextItems: boolean;
  }) => Promise<any>;
}) {
  //check documents https://mozilla.github.io/pdf.js/
  //ret.text = ret.text ? ret.text : "";

  let render_options = {
    //replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
    normalizeWhitespace: false,
    //do not attempt to combine same line TextItem's. The default value is `false`.
    disableCombineTextItems: false
  }

  return pageData.getTextContent(render_options)
    .then(function (textContent) {
      let text = [];
      let curSubjectsCount = 0;
      let isDirectionsParse = false;
      const obj: Subject[] = [];

      for (let i = 0; i < textContent.items.length; i++) {
        const curItem = textContent.items[i].str;
        if (curItem.includes(START_TABLE)) {
          isDirectionsParse = true;
          continue;
        }

        if (!isDirectionsParse) {
          continue;
        }
        // Start parse names
        if (curItem.length && getIsCapitalLetter(curItem) && curSubjectsCount !== SUBJECT_COUNT) {
          let name = curItem;
          let j = i + 1;
          while (!getIsCapitalLetter(textContent.items[j].str) || isEveryLetterCapital(textContent.items[j].str)) {
            name += textContent.items[j].str;
            j++;
          }
          const resSubj = name.split(' ')
            .map((word: string) => {
              if (word.includes('-')) {
                return word.replace('-', '');
              }

              if (word.length === 1 && word !== ' ') {
                return word
              }

              if (word.length && word !== ' ') {
                return word
              }
            })
            .filter((item: any) => item)
            .map((item: string | any[]) => {
              if (item.length === 1) {
                return ` ${item} `;
              }

              return item;
            })
            .join('')
            .trim();
          obj.push({
            name: resSubj,
            value: null
          });
          curSubjectsCount++;

          i = j - 1
          continue
        }

        // start Parse directions with numbers
        if (curSubjectsCount === SUBJECT_COUNT) {
          i = parseDirection(textContent.items, i, obj);
        }
        text.push(curItem);
      }
      console.log(text);
      return text.join('');
    });
}

const options = {
  max: 1000,
  pagerender: render_page,
}

pdf(dataBuffer, options).then(function (data: { text: any; }) {
  const dat = data.text;
  fs.writeFile('output', data.text, ((err: any) => console.error(err)));
});
