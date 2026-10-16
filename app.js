import {
    pipeline,
    env,
} from "https://cdn.jsdelivr.net/npm/@huggingface/transformers";

env.allowLocalModels = false;

const fileUpload = document.getElementById("file-upload");
const imageContainer = document.getElementById("image-container");
const status = document.getElementById("status");
const downloadBtn = document.getElementById("download-btn");

const zoomDialog = document.getElementById("zoom-dialog");
const modalContainer = document.getElementById("modal-container");
const closeModal = document.getElementById("close-modal");

status.textContent = "Loading model...";

const detector = await pipeline("object-detection", "Xenova/detr-resnet-50"); //Transformers.js compatible model for object-detection

async function detect(img) { //Getting output from ai model, triggering renderBox for each output
  status.textContent = "Analyzing...";
  const output = await detector(img.src, {
    threshold: 0.5,
    percentage: true,
  });
  status.textContent = "";
  console.log("output", output);
  output.forEach(renderBox);

  if (downloadBtn) downloadBtn.style.display = "inline-block"; //The download should be available now
}

status.textContent = "Ready";

fileUpload.addEventListener("change", function (e) { //Listen for file upload
  const file = e.target.files[0];
  if (!file) {
    return;
}

  const reader = new FileReader();

  reader.onload = function (e2) {
    imageContainer.innerHTML = "";
    if (downloadBtn) downloadBtn.style.display = "none";

    const image = document.createElement("img");
    image.src = e2.target.result;
    imageContainer.appendChild(image);
    detect(image); //Run the model
  };
  reader.readAsDataURL(file);
});

imageContainer.addEventListener("click", () => {
    if (!imageContainer.querySelector("img")) return;
    modalContainer.innerHTML = imageContainer.innerHTML;
    zoomDialog.showModal(); //Zoom in on image if we click on it
});

    closeModal.addEventListener("click", () => zoomDialog.close());
    zoomDialog.addEventListener("click", (e) => {
    if (e.target === zoomDialog) zoomDialog.close();
});

if (downloadBtn) { //This function is for rendering the image with all detection boxes and make it downloadable
  downloadBtn.addEventListener("click", () => {
    const img = imageContainer.querySelector("img");
    if (!img) return;

    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(img, 0, 0);

    imageContainer.querySelectorAll(".bounding-box").forEach(box => {
      const label = box.querySelector(".bounding-box-label").textContent;
      const color = box.style.borderColor;

      const l = (parseFloat(box.style.left) / 100) * canvas.width;
      const t = (parseFloat(box.style.top) / 100) * canvas.height;
      const w = (parseFloat(box.style.width) / 100) * canvas.width;
      const h = (parseFloat(box.style.height) / 100) * canvas.height;

      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
      ctx.strokeRect(l, t, w, h);

      ctx.fillStyle = color;
      ctx.font = "16px sans-serif";
      ctx.fillRect(l, t - 24, ctx.measureText(label).width + 10, 24);
      
      ctx.fillStyle = "#ffffff";
      ctx.fillText(label, l + 5, t - 7);
    });

    const link = document.createElement("a");
    link.download = "scanned-img.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
}

//Render a bounding box and label on the image
function renderBox({ box, label }) {
  const { xmax, xmin, ymax, ymin } = box;

  //Generate a random color for the box
  const color =
    "#" +
    Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, 0);

  //Draw the box
  const boxElement = document.createElement("div");
  boxElement.className = "bounding-box";
  Object.assign(boxElement.style, {
    borderColor: color,
    left: 100 * xmin + "%",
    top: 100 * ymin + "%",
    width: 100 * (xmax - xmin) + "%",
    height: 100 * (ymax - ymin) + "%",
  });

  //Draw the label
  const labelElement = document.createElement("span");
  labelElement.textContent = label;
  labelElement.className = "bounding-box-label";
  labelElement.style.backgroundColor = color;

  boxElement.appendChild(labelElement);
  imageContainer.appendChild(boxElement);
}