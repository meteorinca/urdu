const textInput = document.getElementById("textInput");
const preview = document.getElementById("preview");
const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");

function syncPreview() {
  preview.textContent = textInput.value || " ";
}

textInput.addEventListener("input", syncPreview);

copyBtn.addEventListener("click", async () => {
  await navigator.clipboard.writeText(textInput.value);
  copyBtn.textContent = "Copied!";
  setTimeout(() => (copyBtn.textContent = "Copy text"), 1200);
});

clearBtn.addEventListener("click", () => {
  textInput.value = "";
  syncPreview();
});

syncPreview();
