async function analyzeEmotion() {
  const input = document.getElementById("message-input").value;
  const resultDiv = document.getElementById("result");

  if (!input.trim()) {
    resultDiv.innerText = "Please enter a message to analyze.";
    return;
  }

  resultDiv.innerText = "Analyzing...";

  const response = await fetch(
    "https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer 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",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: input }),
    }
  );

  const data = await response.json();

  try {
    const emotions = data[0];
    const labels = emotions.map((e) => e.label);
    const scores = emotions.map((e) => (e.score * 100).toFixed(2));

    resultDiv.innerHTML = `Top Emotion: <b>${labels[0]}</b>`;

    // Draw chart
    const ctx = document.getElementById("emotionChart").getContext("2d");
    if (window.emotionChartInstance) {
      window.emotionChartInstance.destroy();
    }

    window.emotionChartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Emotion Confidence (%)",
            data: scores,
            backgroundColor: [
              "#f94144",
              "#f3722c",
              "#f8961e",
              "#43aa8b",
              "#577590",
              "#277da1",
            ],
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
          },
        },
      },
    });

    // Enable Telegram MainButton with result
    Telegram.WebApp.MainButton.setText("📤 Send to Bot");
    Telegram.WebApp.MainButton.show();
    Telegram.WebApp.MainButton.onClick(() => {
      const text = `Top Emotion: ${labels[0]}\n\nFull Analysis:\n` + labels.map((l, i) => `${l}: ${scores[i]}%`).join("\n");
      Telegram.WebApp.sendData(text); // sends data to bot
    });

  } catch (err) {
    resultDiv.innerText = "Error analyzing emotion.";
    console.error(err);
  }
}

function copyResult() {
  const text = document.getElementById("result").innerText;
  navigator.clipboard.writeText(text).then(() => {
    alert("Result copied to clipboard!");
  });
}

// Initialize Telegram WebApp
if (window.Telegram && Telegram.WebApp) {
  Telegram.WebApp.ready();
  Telegram.WebApp.expand(); // optional: expands full screen
}
