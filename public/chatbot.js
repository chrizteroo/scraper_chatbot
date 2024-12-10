// Select DOM elements
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');
const messagesContainer = document.getElementById('messages');

// Function to add a message to the chat window
function addMessage(content, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.textContent = content;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the latest message
}

// Function to handle sending a message
async function sendMessage() {
    const userMessage = chatInput.value.trim();
    if (!userMessage) return; // Exit if input is empty

    // Display the user's message
    addMessage(userMessage, 'user');
    chatInput.value = ''; // Clear input field

    // Display the bot's "Typing..." indicator
    const botMessage = document.createElement('div');
    botMessage.className = 'message bot';
    botMessage.textContent = 'Typing...';
    messagesContainer.appendChild(botMessage);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    try {
        // Send POST request to the backend
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage }), // Use 'message' as per the backend requirement
        });

        // Handle backend response
        if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
        }

        const data = await response.json();
        botMessage.textContent = data.reply || 'No response received.'; // Update with the bot's response
    } catch (error) {
        console.error('Error:', error.message);
        botMessage.textContent = 'An error occurred. Please try again later.'; // Display error message to the user
    }
}

// Event listeners for sending messages
sendButton.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
});
