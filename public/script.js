document.addEventListener("DOMContentLoaded", () => {
  const textInput = document.getElementById("textInput");
  const proofreadBtn = document.getElementById("proofreadBtn");
  const copyBtn = document.getElementById("copyBtn");
  const statusEl = document.getElementById("status");

  let typingTimer;
  const doneTypingInterval = 5000; // 5 seconds
  let isProcessing = false;
  let hasProcessed = false; // Flag to prevent loop processing

  // Focus on the text area as soon as the page loads
  textInput.focus();

  // Set up event listeners
  textInput.addEventListener("input", handleInput);
  proofreadBtn.addEventListener("click", proofreadText);
  copyBtn.addEventListener("click", copyToClipboard);

  function handleInput() {
    // Reset the timer if the user is still typing
    clearTimeout(typingTimer);

    // Reset the processed flag when user makes changes
    hasProcessed = false;

    if (textInput.value.trim() !== "") {
      statusEl.textContent = "Waiting... (5s)";
      statusEl.className = "status waiting";

      // Start a new timer
      typingTimer = setTimeout(() => {
        if (!isProcessing && !hasProcessed && textInput.value.trim() !== "") {
          proofreadText();
        }
      }, doneTypingInterval);
    } else {
      statusEl.textContent = "Ready";
      statusEl.className = "status";
    }
  }

  async function proofreadText() {
    const text = textInput.value.trim();

    if (text === "") {
      alert("Please enter some text to proofread.");
      return;
    }

    // Prevent multiple processing of the same content
    hasProcessed = true;
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

      // Auto copy to clipboard
      copyToClipboard();
    } catch (error) {
      console.error("Error:", error);
      statusEl.textContent = "Error!";
      statusEl.className = "status error";
      // Reset the processed flag on error to allow retrying
      hasProcessed = false;
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
