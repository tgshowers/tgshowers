const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';

function obfuscate() {
  const elements = document.querySelectorAll('.minecraft-obfuscated');
  
  elements.forEach(el => {
    // We maintain the original length of the text
    let obfuscatedText = "";
    for (let i = 0; i < el.textContent.length; i++) {
      obfuscatedText += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    el.innerText = obfuscatedText;
  });
}

// Run the function every 50 milliseconds
setInterval(obfuscate, 50);