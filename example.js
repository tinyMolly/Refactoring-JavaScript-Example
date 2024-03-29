// songs
imagine = ['c', 'cmaj7', 'f', 'am', 'dm', 'g', 'e7'];
somewhereOverTheRainbow = ['c', 'em', 'f', 'g', 'am'];
tooManyCooks = ['c', 'g', 'f'];
iWillFollowYouIntoTheDark = ['f', 'dm', 'bb', 'c', 'a', 'bbm'];
babyOneMoreTime = ['cm', 'g', 'bb', 'eb', 'fm', 'ab'];
creep = ['g', 'gsus4', 'b', 'bsus4', 'c', 'cmsus4', 'cm6'];
paperBag = [
  'bm7',
  'e',
  'c',
  'g',
  'b7',
  'f',
  'em',
  'a',
  'cmaj7',
  'em7',
  'a7',
  'f7',
  'b',
];
toxic = ['cm', 'eb', 'g', 'cdim', 'eb7', 'd7', 'db7', 'ab', 'gmaj7', 'g7'];
bulletproof = ['d#m', 'g#', 'b', 'f#', 'g#m', 'c#'];

var songs = [];
var labels = [];
var allChords = [];
var labelCounts = [];
var labelProbabilities = [];
var chordCountsInLabels = {};
var probabilityOfChordsInLabels = {};

var easy = 'easy';
var medium = 'medium';
var hard = 'hard';

/**
 * @description 用來訓練模型，將一首歌的和弦及難度標籤添加到資料中，同時更新所有和弦(allChords)的列表、所有難度標籤的列表以及難度標籤弦的計數
 * @param {Array} chords 歌曲和弦
 * @param {string} label 難度標籤 : easy、medium、hard
 */
function train(chords, label) {
  songs.push([label, chords]);
  labels.push(label);
  chords.forEach((chord) => {
    if (!allChords.includes(chord)) {
      allChords.push(chord);
    }
  });
  if (Object.keys(labelCounts).includes(label)) {
    labelCounts[label] = labelCounts[label] + 1;
  } else {
    labelCounts[label] = 1;
  }
}

/**
 * @description 計算每個難度標籤出現的機率
 */
function setLabelProbabilities() {
  Object.keys(labelCounts).forEach(function (label) {
    labelProbabilities[label] = labelCounts[label] / songs.length;
  });
}

/**
 * @description 計算每個標籤中每個和弦出現的次數，例如c和弦在easy中出現3次
 */
function setChordCountsInLabels() {
  songs.forEach(function (song) {
    if (chordCountsInLabels[song[0]] === undefined) {
      chordCountsInLabels[song[0]] = {};
    }
    song[1].forEach(function (chord) {
      if (chordCountsInLabels[song[0]][chord] > 0) {
        chordCountsInLabels[song[0]][chord] += 1;
      } else {
        chordCountsInLabels[song[0]][chord] = 1;
      }
    });
  });
}

/**
 * @description 設置每個難度標籤中每個和弦出現的機率
 */
function setProbabilityOfChordsInLabels() {
  probabilityOfChordsInLabels = chordCountsInLabels;
  Object.keys(probabilityOfChordsInLabels).forEach(function (difficulty) {
    Object.keys(probabilityOfChordsInLabels[difficulty]).forEach(function (
      chord
    ) {
      probabilityOfChordsInLabels[difficulty][chord] /= songs.length;
    });
  });
}

train(imagine, easy);
train(somewhereOverTheRainbow, easy);
train(tooManyCooks, easy);
train(iWillFollowYouIntoTheDark, medium);
train(babyOneMoreTime, medium);
train(creep, medium);
train(paperBag, hard);
train(toxic, hard);
train(bulletproof, hard);

setLabelProbabilities();
setChordCountsInLabels();
setProbabilityOfChordsInLabels();

/**
 * @description 對一組和弦進行分類，判斷屬於哪個難度等級
 */
function classify(chords) {
  var smoothing = 1.01;
  console.log('total:', labelProbabilities);
  var classified = {};
  Object.keys(labelProbabilities).forEach(function (difficulty) {
    var first = labelProbabilities[difficulty] + smoothing;
    chords.forEach(function (chord) {
      var probabilityOfChordInLabel =
        probabilityOfChordsInLabels[difficulty][chord];
      if (probabilityOfChordInLabel) {
        first = first * (probabilityOfChordInLabel + smoothing);
      }
    });
    classified[difficulty] = first;
  });
  console.log('classified:', classified);
}

classify(['d', 'g', 'e', 'dm']);
classify(['f#m7', 'a', 'dadd9', 'dmaj7', 'bm', 'bm7', 'd', 'f#m']);
