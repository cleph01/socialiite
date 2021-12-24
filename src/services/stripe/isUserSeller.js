import { firebase } from "../firebase/firebase-config";

export default async function isUserSeller() {
    await firebase.auth().currentUser?.getIdToken(true);
    const decodedToken = await firebase.auth().currentUser?.getIdTokenResult();

    const result = decodedToken?.claims?.stripeRole ? true : false;

    console.log("decoded Token: ", decodedToken);
    console.log("isUserSeller: ", result);
    return result;
}
