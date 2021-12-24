import { Stripe, loadStripe } from "@stripe/stripe-js";

let stripePromise;

const initializeStripe = async () => {
    if (!stripePromise) {
        stripePromise = await loadStripe(
            "pk_test_51K8l3iH9NtzDIYrMq68XZuWedWZJuAgnkf0zf32bBkGUoZdjrjVkWOUjBjBGvkPqTyWJ3jHPSG97WwneEUSe5yk900bH1A1E1G"
        );
    }
    return stripePromise;
};

export default initializeStripe;
