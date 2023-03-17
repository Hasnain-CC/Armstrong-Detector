export const drawRect = (detections, ctx) => {
  const colors = ["green", "red", "yellow", "orange", "purple", "blue"];
  detections.forEach((prediction, index) => {
    const [x, y, width, height] = prediction["bbox"];
    const text = `Object name: ${getObjectName(
      prediction
    )}, Confidence level: ${getScore(prediction)}%`;

    const selectedColor =
      index > colors.length
        ? colors[Math.floor(Math.random() * colors.length)]
        : colors[index];
    //Styling text
    ctx.strokeStyle = selectedColor;
    ctx.font = "22px bold";

    // Draw rectangles and text around the object
    ctx.beginPath();
    ctx.fillStyle = selectedColor;
    ctx.fillText(text, x, y - 4);
    ctx.lineWidth = "4";
    ctx.rect(x, y, width, height);
    ctx.stroke();
  });
};

const getScore = (prediction) => (prediction.score * 100).toFixed(2);

const getObjectName = (prediction) => {
  const str = prediction.class;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getObjectCount = (objects) => {
  const indivisualObjects = {};
  let str = "";
  for (let i = 0; i < objects.length; i++) {
    const objectName = objects[i].class;
    if (!indivisualObjects[objectName]) indivisualObjects[objectName] = 0;
    indivisualObjects[objectName] += 1;
  }

  for (const key in indivisualObjects) {
    const count = indivisualObjects[key];
    str += `${count} ${key}${count > 1 ? "s" : ""},`;
  }
  str = str.slice(0, str.length - 1);
  str += " detected";
  return str;
};

export const speakLength = (objects) => {
  // code will speak the count when space bar is pressed on keyboard
  const msg = new SpeechSynthesisUtterance();
  document.body.onkeyup = function (e) {
    if (e.key === " " || e.code === "Space" || e.keyCode === 32) {
      msg.text = getObjectCount(objects);
      msg.rate = 0.9;
      window.speechSynthesis.speak(msg);
    }
  };
};

export const speakObjectCount = (objects) => {
  const msg = new SpeechSynthesisUtterance();
  msg.text = getObjectCount(objects);
  msg.rate = 0.9;
  window.speechSynthesis.speak(msg);
};
