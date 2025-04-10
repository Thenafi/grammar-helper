document.addEventListener("DOMContentLoaded", () => {
  const textInput = document.getElementById("textInput");
  const proofreadBtn = document.getElementById("proofreadBtn");
  const copyBtn = document.getElementById("copyBtn");
  const statusEl = document.getElementById("status");

  let isProcessing = false;

  // Focus on the text area as soon as the page loads
  textInput.focus();

  // Set up event listeners
  textInput.addEventListener("input", handleInput);
  textInput.addEventListener("keydown", handleKeyDown);
  proofreadBtn.addEventListener("click", proofreadText);
  copyBtn.addEventListener("click", copyToClipboard);

  function handleInput() {
    // Reset the status when user makes changes
    if (textInput.value.trim() !== "") {
      statusEl.textContent = "Ready to proofread";
      statusEl.className = "status";
    } else {
      statusEl.textContent = "Ready";
      statusEl.className = "status";
    }
  }

  function handleKeyDown(e) {
    // Handle Enter for proofreading (only if there's text)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent the default line break
      if (textInput.value.trim() !== "" && !isProcessing) {
        proofreadText();
      }
      return;
    }

    // Handle Shift+Enter for line breaks
    if (e.key === "Enter" && e.shiftKey) {
      // Let the default behavior happen (inserting a line break)
      return;
    }

    // Handle Ctrl+Shift+C for direct copying
    if ((e.key === "C" || e.key === "c") && e.ctrlKey && e.shiftKey) {
      e.preventDefault();
      copyToClipboard();
      return;
    }
  }

  async function proofreadText() {
    const text = textInput.value.trim();

    if (text === "") {
      alert("Please enter some text to proofread.");
      return;
    }

    isProcessing = true;
    statusEl.textContent = "Processing...";
    statusEl.className = "status processing";
    proofreadBtn.disabled = true;
    copyBtn.disabled = true;

    try {
      const response = await fetch("/api/proofread", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Failed to proofread text");
      }

      const data = await response.json();
      textInput.value = data.text;

      statusEl.textContent = "Success!";
      statusEl.className = "status success";
      copyBtn.disabled = false;
    } catch (error) {
      console.error("Error:", error);
      statusEl.textContent = "Error!";
      statusEl.className = "status error";
    } finally {
      isProcessing = false;
      proofreadBtn.disabled = false;
    }
  }

  function copyToClipboard() {
    textInput.select();
    document.execCommand("copy");

    // Visual feedback for copy
    const originalText = copyBtn.textContent;
    copyBtn.textContent = "Copied!";

    setTimeout(() => {
      copyBtn.textContent = originalText;
      // Deselect the text
      window.getSelection().removeAllRanges();
      textInput.focus();
    }, 1500);
  }
});
