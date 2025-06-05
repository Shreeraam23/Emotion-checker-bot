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
        Authorization: "Bearer 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", // Better to store in serverless function
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

window.addEventListener("DOMContentLoaded", () => {
  const tg = window.Telegram.WebApp;
  tg.ready();
  const user = tg.initDataUnsafe?.user;
  if (user) {
    document.getElementById("user-info").innerText = `Hello, ${user.first_name}`;
  }
});
