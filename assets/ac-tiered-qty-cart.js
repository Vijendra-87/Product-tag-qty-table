
(function () {
    try {
        var nativeFetch = window.fetch;
        var isUpdatingCart = false;

        window.fetch = function (...args) {
            try {
                if (typeof args[0] === 'string' && (args[0].includes("/cart/change") || args[0].includes("/cart/add"))) {
                    if (!isUpdatingCart) {
                        isUpdatingCart = true;
                        setTimeout(async function () {
                            await setDateTimeInCart();
                            isUpdatingCart = false;
                        }, 800);
                    }
                }
            } catch (err) {
                // console.error("Error in intercepting fetch:", err);
            }
            return nativeFetch.apply(window, args);
        }
    } catch (e) {
        // console.error("Error in overriding fetch:", e);
    }

    async function setDateTimeInCart() {
        try {
            const response = await fetch('/cart/update.js', {
                method: "POST",
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    attributes: {
                        Discountly_dateTime: `${globalFields.Storetime()},${Shopify.shop}`,
                        discountPosId: "online"
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            // console.log('Cart updated successfully:', data);
        } catch (error) {
            console.log('Failed to update cart:');
        }
    }

    // Add event listener for page load to update the cart attribute
    window.addEventListener('load', async () => {
        await setDateTimeInCart();
    });
})();


