import { db, firebase } from "../firebase/firebase-config";
import getStripe from "./initializeStripe";

export async function createCheckoutSession(uid) {
    const checkoutSessionRef = await db
        .collection("users")
        .doc(uid)
        .collection("checkout_sessions")
        .add({
            price: "price_1K9eYUH9NtzDIYrM8L7oy3aZ", // price Id from products price in the stripe dashboard
            success_url: window.location.origin, // Return user to this screen on successful purchase
            cancel_url: window.location.origin, // Return user to this screen on failed purchase
        });

    // Wait for the CheckoutSession to get attached by the extension
    checkoutSessionRef.onSnapshot(async (snap) => {
        const { sessionId } = snap.data();

        if (sessionId) {
            // We have a seesion, let's redirect to Checkout
            // Init Stripe
            const stripe = await getStripe();
            stripe.redirectToCheckout({ sessionId });
        }
    });
}
