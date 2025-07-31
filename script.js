const cartButton = document.getElementById('cartButton');
const closeCartButton = document.getElementById('closeCartButton');
const cartModal = document.getElementById('cartModal');
const cartItemsContainer = document.getElementById('cartItems');
const cartItemCount = document.getElementById('cartItemCount');
const cartTotal = document.getElementById('cartTotal');
const emptyCartMessage = document.getElementById('emptyCartMessage');
const servicesGrid = document.getElementById('servicesGrid');
const serviceCards = document.querySelectorAll('.service-card');
const contactForm = document.getElementById('contactForm'); // Get the contact form
const proceedToCheckoutButton = document.getElementById('proceedToCheckoutButton'); // Get the checkout button

// Elements for Service Recommendation Modal
const serviceRecommendationModal = document.getElementById('serviceRecommendationModal');
const closeServiceRecommendationModalButton = document.getElementById('closeServiceRecommendationModal');
const serviceRecommendationForm = document.getElementById('serviceRecommendationForm');
const serviceOfInterestInput = document.getElementById('serviceOfInterest');
const suggestionResultDiv = document.getElementById('suggestionResult');
const suggestionContentDiv = document.getElementById('suggestionContent');
const loadingIndicator = document.getElementById('loadingIndicator');

// New elements for Message Status Modal
const messageStatusModal = document.getElementById('messageStatusModal');
const messageStatusTitle = document.getElementById('messageStatusTitle');
const messageStatusContent = document.getElementById('messageStatusContent');
const closeMessageStatusModalButton = document.getElementById('closeMessageStatusModal');

let cart = [];

// Function to update cart display
function updateCart() {
    cartItemsContainer.innerHTML = ''; // Clear current items
    let total = 0;

    if (cart.length === 0) {
        emptyCartMessage.classList.remove('hidden');
        proceedToCheckoutButton.disabled = true; // Disable checkout if cart is empty
        proceedToCheckoutButton.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
        emptyCartMessage.classList.add('hidden');
        proceedToCheckoutButton.disabled = false; // Enable checkout if cart has items
        proceedToCheckoutButton.classList.remove('opacity-50', 'cursor-not-allowed');
        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('flex', 'justify-between', 'items-center', 'py-2', 'border-b', 'border-gray-100');
            itemElement.innerHTML = `
                <div>
                    <p class="font-medium text-gray-800">${item.name}</p>
                    <p class="text-sm text-gray-500">Cantidad: ${item.quantity}</p>
                </div>
                <div class="flex items-center space-x-2">
                    <button class="quantity-btn bg-gray-200 text-gray-700 px-2 py-1 rounded-md hover:bg-gray-300 transition duration-200" data-index="${index}" data-action="decrease">-</button>
                    <span class="text-lg font-semibold">${item.quantity}</span>
                    <button class="quantity-btn bg-gray-200 text-gray-700 px-2 py-1 rounded-md hover:bg-gray-300 transition duration-200" data-index="${index}" data-action="increase">+</button>
                    <button class="remove-from-cart-btn text-red-500 hover:text-red-700 transition duration-200" data-index="${index}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
            // Since prices are removed, total will remain 0 unless you add a default value or reintroduce pricing logic
            // total += item.price * item.quantity;
        });
    }

    cartTotal.textContent = `S/ ${total.toFixed(2)}`; // This will always show S/ 0.00 since prices are 0
    cartItemCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

// "Solicitar Cotización" button now adds to cart and opens cart modal
document.querySelectorAll('.request-quote-btn').forEach(button => {
    button.addEventListener('click', (event) => {
        const serviceName = event.target.dataset.serviceName;
        
        const existingItem = cart.find(item => item.name === serviceName);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            // Add a default price of 0.00 as per previous instruction
            cart.push({ name: serviceName, price: 0.00, quantity: 1 });
        }
        updateCart();
        cartModal.classList.remove('hidden'); // Open cart when item is added
    });
});

// Remove from cart and quantity adjustment
cartItemsContainer.addEventListener('click', (event) => {
    if (event.target.closest('.remove-from-cart-btn')) {
        const index = event.target.closest('.remove-from-cart-btn').dataset.index;
        cart.splice(index, 1);
        updateCart();
    } else if (event.target.closest('.quantity-btn')) {
        const button = event.target.closest('.quantity-btn');
        const index = button.dataset.index;
        const action = button.dataset.action;

        if (action === 'increase') {
            cart[index].quantity++;
        } else if (action === 'decrease') {
            cart[index].quantity--;
            if (cart[index].quantity <= 0) {
                cart.splice(index, 1); // Remove if quantity drops to 0
            }
        }
        updateCart();
    }
});

// Toggle cart modal visibility
cartButton.addEventListener('click', () => {
    cartModal.classList.toggle('hidden');
});

closeCartButton.addEventListener('click', () => {
    cartModal.classList.add('hidden');
});

// Close cart modal when clicking outside
cartModal.addEventListener('click', (event) => {
    if (event.target === cartModal) {
        cartModal.classList.add('hidden');
    }
});

// New: Event listener for "Proceder al Pago" button
if (proceedToCheckoutButton) {
    proceedToCheckoutButton.addEventListener('click', async () => {
        if (cart.length === 0) {
            showMessageStatus('Carrito Vacío', 'No hay servicios en el carrito para procesar.', false);
            return;
        }

        let orderDetails = "Detalles del Pedido:\n\n";
        cart.forEach(item => {
            orderDetails += `- ${item.name} (Cantidad: ${item.quantity})\n`;
        });
        orderDetails += "\nPor favor, contáctenos para coordinar los detalles y la cotización final de estos servicios.";

        const recipientEmail = "serviciosanitariosdelperu@gmail.com";
        const subject = "Solicitud de Cotización de Servicios Perú Sano";
        const body = encodeURIComponent(orderDetails); // Encode for URL

        // Simulate sending the message (using mailto link for demonstration)
        // In a real application, you would send this data to a server-side endpoint
        // e.g., using fetch() or XMLHttpRequest
        try {
            // Simulate network request delay
            await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 seconds delay

            // For actual email sending, a backend is required.
            // Here, we simulate success and suggest using mailto if user wants to send manually.
            console.log(`Order sent to: ${recipientEmail}`);
            console.log(`Subject: ${subject}`);
            console.log(`Body: ${orderDetails}`);

            showMessageStatus(
                '¡Pedido Enviado!',
                'Su solicitud de cotización ha sido enviada con éxito. Le contactaremos a la brevedad posible para coordinar los detalles.',
                true
            );

            // Optionally, open mail client (user will need to confirm sending)
            // window.location.href = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${body}`;

            cart = []; // Clear cart after successful "send"
            updateCart();
            cartModal.classList.add('hidden'); // Close cart modal
        } catch (error) {
            console.error("Error sending order:", error);
            showMessageStatus(
                'Error al Enviar Pedido',
                'Hubo un problema al procesar su solicitud. Por favor, inténtelo de nuevo más tarde o contáctenos directamente.',
                false
            );
        }
    });
}


// Close service recommendation modal
closeServiceRecommendationModalButton.addEventListener('click', () => {
    serviceRecommendationModal.querySelector('div').classList.remove('active');
    setTimeout(() => {
        serviceRecommendationModal.classList.add('hidden');
    }, 300); // Match CSS transition duration
});

// Close service recommendation modal when clicking outside
serviceRecommendationModal.addEventListener('click', (event) => {
    if (event.target === serviceRecommendationModal) {
        serviceRecommendationModal.querySelector('div').classList.remove('active');
        setTimeout(() => {
            serviceRecommendationModal.classList.add('hidden');
        }, 300); // Match CSS transition duration
    }
});

// Show message status modal
function showMessageStatus(title, message, isSuccess) {
    messageStatusTitle.textContent = title;
    messageStatusContent.textContent = message;
    if (isSuccess) {
        messageStatusTitle.classList.remove('text-red-600');
        messageStatusTitle.classList.add('text-green-700');
    } else {
        messageStatusTitle.classList.remove('text-green-700');
        messageStatusTitle.classList.add('text-red-600');
    }
    messageStatusModal.classList.remove('hidden');
    // Trigger animation
    setTimeout(() => {
        messageStatusModal.querySelector('div').classList.add('active');
    }, 10);
}

// Close message status modal
closeMessageStatusModalButton.addEventListener('click', () => {
    messageStatusModal.querySelector('div').classList.remove('active');
    setTimeout(() => {
        messageStatusModal.classList.add('hidden');
    }, 300); // Match CSS transition duration
});

messageStatusModal.addEventListener('click', (event) => {
    if (event.target === messageStatusModal) {
        messageStatusModal.querySelector('div').classList.remove('active');
        setTimeout(() => {
            messageStatusModal.classList.add('hidden');
        }, 300); // Match CSS transition duration
    }
});


// Smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Event listener for the contact form submission
if (contactForm) {
    contactForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent default form submission

        const name = this.elements['nombre'].value;
        const email = this.elements['email'].value;
        const message = this.elements['mensaje'].value;

        // Simulate sending the message
        // In a real application, you would send this data to a server-side endpoint
        // e.g., using fetch() or XMLHttpRequest
        
        // Show loading indicator (if you had one, otherwise skip)
        // For this example, we'll just show the modal after a delay
        
        try {
            // Simulate network request delay
            await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 seconds delay

            // Simulate a successful response
            console.log(`Message sent from: ${name} (${email}) to serviciosanitariodelperu@gmail.com`);
            console.log(`Message content: ${message}`);

            showMessageStatus('¡Mensaje Enviado!', 'Su mensaje ha sido enviado con éxito. Le responderemos a la brevedad posible.', true);
            contactForm.reset(); // Clear the form
        } catch (error) {
            console.error("Error sending message:", error);
            showMessageStatus('Error al Enviar Mensaje', 'Hubo un problema al enviar su mensaje. Por favor, inténtelo de nuevo más tarde.', false);
        }
    });
}

// Function to call Gemini API with exponential backoff
async function callGeminiApi(prompt) {
    const MAX_RETRIES = 5;
    const BASE_DELAY_MS = 1000; // 1 second

    for (let i = 0; i < MAX_RETRIES; i++) {
        try {
            const chatHistory = [];
            chatHistory.push({ role: "user", parts: [{ text: prompt }] });
            const payload = { contents: chatHistory };
            const apiKey = ""; // Canvas will automatically provide it in runtime
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                // If response is not OK, throw an error to trigger retry or catch
                const errorData = await response.json();
                throw new Error(`API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
            }

            const result = await response.json();
            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                return result.candidates[0].content.parts[0].text;
            } else {
                throw new Error("Unexpected API response structure or no content.");
            }
        } catch (error) {
            console.error(`Error calling Gemini API (attempt ${i + 1}/${MAX_RETRIES}):`, error);
            if (i < MAX_RETRIES - 1) {
                const delay = BASE_DELAY_MS * Math.pow(2, i);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                throw error; // Re-throw error if max retries reached
            }
        }
    }
}


// Event listener for the service recommendation form submission
if (serviceRecommendationForm) {
    serviceRecommendationForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent default form submission

        const propertyType = document.getElementById('propertyType').value;
        const areaSize = document.getElementById('areaSize').value;
        const problemDescription = document.getElementById('problemDescription').value;
        const serviceName = document.getElementById('serviceOfInterest').value;

        // Show loading indicator and hide previous result
        loadingIndicator.classList.remove('hidden');
        suggestionResultDiv.classList.add('hidden');
        suggestionContentDiv.innerHTML = '';

        const prompt = `Eres un experto en servicios de saneamiento ambiental en Perú. Basado en la siguiente información, genera una recomendación de servicio detallada y profesional para una cotización. No incluyas precios.

Tipo de propiedad: ${propertyType}
Tamaño del área: ${areaSize}
Problema específico: ${problemDescription}
Servicio de interés: ${serviceName}

La recomendación debe incluir:
1.  Una breve descripción del problema según la información proporcionada.
2.  El servicio principal recomendado y por qué es adecuado.
3.  Posibles servicios complementarios que podrían considerarse.
4.  La importancia de una evaluación en sitio para una cotización precisa.
5.  Un tono profesional y tranquilizador.
6.  Utiliza viñetas o listas para organizar la información y hazla fácil de leer.`;

        try {
            const generatedSuggestion = await callGeminiApi(prompt);
            suggestionContentDiv.innerHTML = generatedSuggestion.replace(/\n/g, '<br>'); // Display newlines as breaks
            suggestionResultDiv.classList.remove('hidden');
        } catch (error) {
            console.error("Failed to generate suggestion:", error);
            suggestionContentDiv.innerHTML = `<p class="text-red-600">Lo sentimos, no pudimos generar una sugerencia en este momento. Por favor, inténtelo de nuevo más tarde o contáctenos directamente.</p>`;
            suggestionResultDiv.classList.remove('hidden');
        } finally {
            loadingIndicator.classList.add('hidden');
        }
    });
}

// Initial cart update on load
updateCart();
