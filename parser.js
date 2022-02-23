const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('file.pdf');

const SUBJECT_COUNT = 11;
// const START_TABLE = 'на образовательные программы';
const START_TABLE = 'шкале';
const START_TABLE_VALUES = ''

const replaceEverySymbol = (word, target, res) => {
  return word.split('').map((letter) => letter === target ? res : letter).join('')
}

const getIsCapitalLetter = (word) => {
  return /[А-Я]/.test(word.charAt(0))
}

const isEveryLetterCapital = (word) => {
  return word.split('').every((item) => /[А-Я]/.test(item))
}

function render_page(pageData) {
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
      const res = [];
      const obj = [];

      for (let i = 0; i < textContent.items.length; i++) {
        const curItem = textContent.items[i].str;
        if (curItem.includes(START_TABLE)) {
          console.log('FOUND');
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
            .map((word) => {
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
            .filter((item) => item)
            .map((item) => {
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
	        console.log('cur', curSubjectsCount, resSubj, i, j)

					if (curSubjectsCount === SUBJECT_COUNT) {
						// why? huy znaet
						// Skip last subject
						i += j - i - 1
					}

	        continue

        }

				// start Parse directions with numbers
	      if (curSubjectsCount === SUBJECT_COUNT) {
					console.log(curItem.split(' '))


		      text.push(curItem);
	      }
      }
			console.log('resSubj', obj);
      return text.join('');
    });
}

const options = {
  max: 100,
  pagerender: render_page,
}

pdf(dataBuffer, options).then(function (data) {
  const dat = data.text;
  fs.writeFile('output', data.text, (err => console.error(err)));
});
