import React, { useEffect, useState } from "react";
import axios from "axios";

// https://api.instagram.com/oauth/authorize
//   ?client_id=1272645726582203
//   &redirect_uri=https://socialiite.firebaseapp.com/__/auth/handler
//   &scope=user_profile,user_media
//   &response_type=code

//   code = AQD_p5wZJpaSaB0zDLYVJEV365zbbARqxOEnDANw40vk3S0WKJ4y4G6e3yPwc5_oQWKQBVbKrJEKaQaJs3QAISKPMwFgkFhvD1qKBye6lqZ0MJN9Gpvs4wOXnSbmy57BdHVdHIrDeS0LtO0KqeV-e-QKHtqt_SalZRhGDBYfq9ItfcL15RYlBEGk5FSqU-ckDdb9uzxPpd-b9i9MSk_nxdinooxRUd-OWB7TzbRI29GKeg

//   curl -X POST https://api.instagram.com/oauth/access_token -F client_id=1272645726582203 -F client_secret=380215c404940b5e80b18212b42f20dd -F grant_type=authorization_code -F redirect_uri=https://socialiite.firebaseapp.com/__/auth/handler -F code=AQD_p5wZJpaSaB0zDLYVJEV365zbbARqxOEnDANw40vk3S0WKJ4y4G6e3yPwc5_oQWKQBVbKrJEKaQaJs3QAISKPMwFgkFhvD1qKBye6lqZ0MJN9Gpvs4wOXnSbmy57BdHVdHIrDeS0LtO0KqeV-e-QKHtqt_SalZRhGDBYfq9ItfcL15RYlBEGk5FSqU-ckDdb9uzxPpd-b9i9MSk_nxdinooxRUd-OWB7TzbRI29GKeg

//   {"access_token": "IGQVJVRzJKWE5pcmFrQXgxdGNfYVpYSzZA3dERFV25ONk1NbkxYaGFXb2haYmh3MUN1cV9xdUdIVk84d1hHUUkzVGdPZA1ZARX2VMZAzFiU1BObFJ0b3UyQ2dZAOGVCU19vSWlVam41Rm05cHg4SkhLR20zUEF3b1RqT2hWZAGFz", "user_id": 17841407598753910}

//   curl -X GET \
//   'https://graph.instagram.com/17841407598753910?fields=id,username&access_token=IGQVJVRzJKWE5pcmFrQXgxdGNfYVpYSzZA3dERFV25ONk1NbkxYaGFXb2haYmh3MUN1cV9xdUdIVk84d1hHUUkzVGdPZA1ZARX2VMZAzFiU1BObFJ0b3UyQ2dZAOGVCU19vSWlVam41Rm05cHg4SkhLR20zUEF3b1RqT2hWZAGFz'

//   curl -i -X GET "https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=380215c404940b5e80b18212b42f20dd&access_token=IGQVJVRzJKWE5pcmFrQXgxdGNfYVpYSzZA3dERFV25ONk1NbkxYaGFXb2haYmh3MUN1cV9xdUdIVk84d1hHUUkzVGdPZA1ZARX2VMZAzFiU1BObFJ0b3UyQ2dZAOGVCU19vSWlVam41Rm05cHg4SkhLR20zUEF3b1RqT2hWZAGFz"

//   {"access_token":"IGQVJWQXNXVlUtNll6RS1XX0lDdlBya0l6R2phUlBjdmhXb3RUODU3UnFtVTZAOM2JQSDZAuWS14N1NnNGotR2ZAXdlF4RFFOYi11VkJtaXJfankzSE1OSVd0YUc2NkhqR3hyREg2Tjd3","token_type":"bearer","expires_in":5184000}

// curl -X GET \
//  "https://graph.facebook.com/v12.0/ig_hashtag_search?user_id=1272645726582203&q=bluebottle&access_token=IGQVJYWUs3WGExdmlqb1dyZADZALT1VnVm5RMVdfSTN6SGlrQ1BrSGlkTXc4S3JuRFFjTlY2d3FnakJBR09LQzdRMktJalYyWTllclFuczdMYU0wM0JTZA3NCa0p2LXljbXYyXzN4VkZAsUDRnWU5xLVp6MAZDZD"

// curl -X GET \
//  "https://graph.facebook.com/v12.0/ig_hashtag_search?user_id=1272645726582203&q=bluebottle&access_token=IGQVJYWUs3WGExdmlqb1dyZADZALT1VnVm5RMVdfSTN6SGlrQ1BrSGlkTXc4S3JuRFFjTlY2d3FnakJBR09LQzdRMktJalYyWTllclFuczdMYU0wM0JTZA3NCa0p2LXljbXYyXzN4VkZAsUDRnWU5xLVp6MAZDZD"

// curl -X GET "https://graph.facebook.com/17873440459141021/recent_media?user_id=17841405309211844&access_token=IGQVJYWUs3WGExdmlqb1dyZADZALT1VnVm5RMVdfSTN6SGlrQ1BrSGlkTXc4S3JuRFFjTlY2d3FnakJBR09LQzdRMktJalYyWTllclFuczdMYU0wM0JTZA3NCa0p2LXljbXYyXzN4VkZAsUDRnWU5xLVp6MAZDZD"

// 17841405309211844

function HotSpot() {
    //     const [tags, setTags] = useState();
    //     useEffect(() => {
    //         axios
    //             .get("https://www.instagram.com/explore/tags/chickenshack/")
    //             .then((response) => {
    //                 console.log("IG Posts: ", response);
    //                 setTags(response);
    //             })
    //             .catch((error) => {
    //                 console.log("Error: ", error);
    //             });
    //     }, []);

    return <div>On it</div>;
}

export default HotSpot;
